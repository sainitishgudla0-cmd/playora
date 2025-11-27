import Order from "../models/Order.js";
import Booking from "../models/Booking.js"; // legacy
import RoomType from "../models/RoomType.js";
import Game from "../models/gameModel.js";

/* ----------------------------- helpers ----------------------------- */
const recomputeTotal = (order) => {
  order.totalAmount = (order.items || []).reduce((sum, it) => {
    const qty = Number(it.quantity || 1);
    const price = Number(it.price || 0);
    return sum + qty * price;
  }, 0);
};

const ensurePendingOrder = async (userId) => {
  let order = await Order.findOne({ user: userId, status: "Pending" });
  if (!order) order = await Order.create({ user: userId, items: [] });
  return order;
};

// ✅ Normalize date range and overlap check
function normalizeRange(startLike, endLike) {
  const start = new Date(startLike);
  const end = new Date(endLike);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && aEnd >= bStart;
}

/* ---------------------------- UNIFIED CART ---------------------------- */
/**
 * POST /api/bookings/add-to-cart
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      type,
      refId,
      startDate,
      endDate,
      guests,
      slot,
      quantity = 1,
    } = req.body;

    if (!type || !refId) {
      return res.status(400).json({ error: "type and refId are required" });
    }

    let newItem;

    // ✅ ROOMS
    if (type === "room") {
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "startDate and endDate are required for room" });
      }

      const room = await RoomType.findById(refId);
      if (!room) return res.status(404).json({ error: "Room type not found" });

      newItem = {
        type,
        refId: room._id,
        title: room.name,
        thumbnail: room.thumbnail || room.image || null,
        price: Number(room.pricePerNight || 0),
        quantity: Number(quantity || 1),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        meta: {
          category: room.category,
          subCategory: room.subCategory,
          guests: guests ?? 1,
        },
      };
    }

    // ✅ GAMES
    else if (type === "game") {
      if (!startDate) {
        return res.status(400).json({ error: "startDate is required for game" });
      }

      const game = await Game.findById(refId);
      if (!game) return res.status(404).json({ error: "Game not found" });

      newItem = {
        type,
        refId: game._id,
        title: game.title,
        thumbnail: game.thumbnail || null,
        price: Number(game.price ?? 0),
        quantity: Number(quantity || 1),
        startDate: new Date(startDate),
        meta: {
          category: game.category,
          slot: slot || null,
        },
      };
    } else {
      return res.status(400).json({ error: "Invalid type. Use 'room' or 'game'." });
    }

    const order = await ensurePendingOrder(userId);
    order.items.push(newItem);
    recomputeTotal(order);
    await order.save();

    return res.json(order);
  } catch (err) {
    console.error("addToCart error:", err);
    return res.status(500).json({ error: "Failed to add item to cart" });
  }
};

/**
 * GET /api/bookings/cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({ user: userId, status: "Pending" }).lean();
    if (!order)
      return res.json({ items: [], totalAmount: 0, status: "Pending" });
    return res.json(order);
  } catch (err) {
    console.error("getCart error:", err);
    return res.status(500).json({ error: "Failed to fetch cart" });
  }
};

/**
 * PUT /api/bookings/confirm/:bookingId
 */
export const confirmBooking = async (req, res) => {
  const session = await RoomType.startSession();
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    const order = await Order.findOne({ _id: bookingId, user: userId });
    if (!order) return res.status(404).json({ msg: "Order not found" });
    if (order.status !== "Pending") {
      return res.status(400).json({ msg: "Only Pending orders can be confirmed" });
    }

    await session.withTransaction(async () => {
      for (const it of order.items) {
        if (it.type !== "room" || !it.refId) continue;

        const room = await RoomType.findById(it.refId).session(session);
        if (!room) throw new Error("Room type not found");

        const { start, end } = normalizeRange(it.startDate, it.endDate);

        const conflict = (room.bookedDates || []).some((b) =>
          rangesOverlap(start, end, new Date(b.checkIn), new Date(b.checkOut))
        );

        if (conflict) {
          throw new Error(`CONFLICT: Room "${room.name}" already booked for selected dates`);
        }

        room.bookedDates.push({ checkIn: start, checkOut: end });
        if (typeof room.availableRooms === "number" && room.availableRooms > 0) {
          room.availableRooms -= 1;
        }
        await room.save({ session });
      }

      order.status = "Booked";
      await order.save({ session });
    });

    return res.json({
      msg: "Order confirmed successfully ✅",
      order: await Order.findById(bookingId),
    });
  } catch (err) {
    if (String(err.message || "").startsWith("CONFLICT:")) {
      return res
        .status(400)
        .json({ error: err.message.replace("CONFLICT: ", "") });
    }
    console.error("confirmBooking error:", err);
    return res.status(500).json({ error: "Failed to confirm order" });
  } finally {
    await session.endSession();
  }
};

/**
 * GET /api/bookings/my-bookings
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      user: userId,
      status: { $ne: "Pending" },
    })
      .sort({ createdAt: -1 })
      .lean();

    const legacyRooms = await Booking.find({ user: userId })
      .populate("roomType")
      .sort({ createdAt: -1 })
      .lean();

    const legacyAsOrders = legacyRooms.map((rb) => ({
      _id: rb._id,
      user: rb.user,
      items: [
        {
          type: "room",
          refId: rb.roomType?._id,
          title: rb.roomType?.name || "Room",
          thumbnail: rb.roomType?.thumbnail || rb.roomType?.image || null,
          price: Number(rb.totalAmount || 0),
          quantity: 1,
          startDate: rb.checkInDate ? new Date(rb.checkInDate) : undefined,
          endDate: rb.checkOutDate ? new Date(rb.checkOutDate) : undefined,
          meta: {
            category: rb.roomType?.category,
            subCategory: rb.roomType?.subCategory,
            guests: rb.guests,
          },
        },
      ],
      totalAmount: Number(rb.totalAmount || 0),
      status: rb.status || "Booked",
      createdAt: rb.createdAt,
      updatedAt: rb.updatedAt,
      __legacy: true,
    }));

    const unified = [...orders, ...legacyAsOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json(unified);
  } catch (err) {
    console.error("getUserBookings error:", err);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

/**
 * PUT /api/bookings/cancel/:bookingId
 */
export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    let updated = await Order.findOneAndUpdate(
      { _id: bookingId, user: userId },
      { $set: { status: "Cancelled" } },
      { new: true }
    );

    if (!updated) {
      updated = await Booking.findOneAndUpdate(
        { _id: bookingId, user: userId },
        { $set: { status: "Cancelled" } },
        { new: true }
      );
    }

    if (!updated) return res.status(404).json({ msg: "Booking not found" });

    if (updated.items && updated.status === "Cancelled") {
      for (const it of updated.items) {
        if (it.type !== "room" || !it.refId) continue;

        const room = await RoomType.findById(it.refId);
        if (!room) continue;

        const { start, end } = normalizeRange(it.startDate, it.endDate);

        room.bookedDates = (room.bookedDates || []).filter((b) => {
          const bStart = new Date(b.checkIn);
          const bEnd = new Date(b.checkOut);
          return !(
            bStart.getTime() === start.getTime() &&
            bEnd.getTime() === end.getTime()
          );
        });

        if (typeof room.availableRooms === "number") room.availableRooms += 1;
        await room.save();
      }
    }

    return res.json({ msg: "Cancelled successfully", data: updated });
  } catch (err) {
    console.error("cancelBooking error:", err);
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
};

/* ------------------------- LEGACY DIRECT CREATE ------------------------- */
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomTypeId, checkInDate, checkOutDate, totalAmount } = req.body;

    const room = await RoomType.findById(roomTypeId);
    if (!room) return res.status(404).json({ msg: "Room type not found" });

    const { start, end } = normalizeRange(checkInDate, checkOutDate);

    const conflict = (room.bookedDates || []).some((b) =>
      rangesOverlap(start, end, new Date(b.checkIn), new Date(b.checkOut))
    );
    if (conflict)
      return res.status(400).json({ msg: "Room already booked for those dates" });

    const booking = await Booking.create({
      user: userId,
      roomType: roomTypeId,
      checkInDate: start,
      checkOutDate: end,
      totalAmount,
      status: "Booked",
    });

    room.bookedDates.push({ checkIn: start, checkOut: end });
    if (typeof room.availableRooms === "number" && room.availableRooms > 0)
      room.availableRooms -= 1;
    await room.save();

    res.status(201).json({ msg: "Booking successful", booking });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ error: err.message });
  }
};
