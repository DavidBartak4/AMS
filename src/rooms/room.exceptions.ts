import { ConflictException, NotFoundException } from "@nestjs/common";

export const RoomErrorMessages = {
    ROOM_CODE_ALREADY_IN_USE: "roomCode already in use",
    MAIN_IMAGE_CONFLICT: "mainImage (data) and mainImage (file) conflict",
    ROOM_NOT_FOUND: "Room not found"
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