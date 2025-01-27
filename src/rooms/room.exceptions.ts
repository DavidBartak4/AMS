import { ConflictException, NotFoundException } from "@nestjs/common";

export const RoomErrorMessages = {
    ROOM_CODE_ALREADY_IN_USE: "roomCode already in use",
    MAIN_IMAGE_CONFLICT: "mainImage (data) and mainImage (file) conflict",
    ROOM_NOT_FOUND: "Room not found",
    CREATE_ROOM: [
        "name must be a string",
        "roomTypeId must be a valid MongoDB ID",
        "description must be a string",
        "mainImage must be a valid URL",
        "images must be an array of strings",
        "price must be a valid Price object",
        "pricing must be a string",
        "roomCode must be a string",
        "capacity must be a number",
        "attributeIds must be an array of valid MongoDB IDs",
        "data must be a valid CreateRoomDto object"
    ],
    UPDATE_ROOM: [
        "name must be a string",
        "roomTypeId must be a valid MongoDB ID",
        "description must be a string",
        "mainImage must be a valid URL",
        "images must be an array of strings",
        "price must be a valid Price object",
        "pricing must be a string",
        "roomCode must be a string",
        "capacity must be a number",
        "attributeIds must be an array of valid MongoDB IDs",
        "data must be a valid UpdateRoomDto object"
    ],
    ROOM_QUERY: [
        "name must be a string",
        "roomTypeId must be a valid MongoDB ID",
        "capacity must be a number",
        "pricing must be a string",
        "roomCode must be a string",
        "minPrice must be a number",
        "maxPrice must be a number",
        "priceValue must be a number",
        "priceCurrency must be a valid ISO4217 currency code"
    ]
}

export class RoomMainImageConflictException extends ConflictException {
    constructor() {
        super(RoomErrorMessages.MAIN_IMAGE_CONFLICT)
    }
}

export class RoomNotFoundException extends NotFoundException {
    constructor() {
        super(RoomErrorMessages.ROOM_NOT_FOUND)
    }
}