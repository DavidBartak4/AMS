import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger"
import { FileInterceptor } from "@nestjs/platform-express"
import { filterFileTypes } from "src/common/filters/file.filter"
import { File } from "multer"
import { CreateAttributeMultipartDto } from "./dto/create-attribute.dto"
import { AttributesService } from "./attribute.service"
import { AttributeParamsDto } from "./dto/attribute-params.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { AttributesQueryDto } from "./dto/attributes-query.dto"
import { UpdateAttributeMultipartDto } from "./dto/update-attribute.dto"
import { ApiResponse } from "src/common/decorators/api-response.decorator"
import { AttributeResponseDto } from "./dto/attribute-response.dto"
import { PaginatedAttributesResponseDto } from "./dto/paginated-attributes-response.dto"
import { ApiErrorMessages } from "src/common/api.exceptions"
import { AuthErrorMessages } from "src/auth/auth.exceptions"
import { AttributeErrorMessages } from "./attribute.exceptions"

@Controller("attributes")
@ApiTags("Attributes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AttributesController {
    constructor(private readonly attributesService: AttributesService) {}

    @Post()
    @ApiOperation({ summary: "Creates an attribute" })
    @ApiConsumes("multipart/form-data")
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 400, description: [...AttributeErrorMessages.CREATE_ATTRIBUTE, ...ApiErrorMessages.MULTIPART_DATA, ApiErrorMessages.UNSUPPORTED_FILE_TYPE]})
    @ApiResponse({ status: 409, description: [AttributeErrorMessages.ATTRIBUTE_NAME_IN_USE, AttributeErrorMessages.MAIN_IMAGE_CONFLICT]})
    @ApiResponse({ status: 201, type: AttributeResponseDto})
    @UseInterceptors(FileInterceptor("image", {
        fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"])
    }))
    async createAttribute(@Body() createAttributeMultipartDto: CreateAttributeMultipartDto, @UploadedFile() imageFile?: File) {
        const createAttributeDto = createAttributeMultipartDto.data
        return await this.attributesService.createAttribute(createAttributeDto, imageFile)
    }

    @Get(":attributeId")
    @ApiOperation({ summary: "Gets an attribute by ID" })
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 400, description: [...AttributeErrorMessages.UPDATE_ATTRIBUTE, ...AttributeErrorMessages.ATTRIBUTE_PARAMS]})
    @ApiResponse({ status: 409, description: AttributeErrorMessages.MAIN_IMAGE_CONFLICT})
    @ApiResponse({ status: 404, description: AttributeErrorMessages.ATTRIBUTE_NOT_FOUND})
    @ApiResponse({ status: 200, type: AttributeResponseDto})
    async getAttribute(@Param() attributeParamsDto: AttributeParamsDto) {
        return await this.attributesService.getAttribute({id: attributeParamsDto.attributeId})
    }

    @Get()
    @ApiOperation({ summary: "Gets a paginated list of attributes" })
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 400, description: AttributeErrorMessages.ATTRIBUTE_QUERY})
    @ApiResponse({ status: 200, type: PaginatedAttributesResponseDto})
    async getPaginatedAttributes(@Query() attributesQueryDto: AttributesQueryDto) {
        return await this.attributesService.getPaginatedAttributes(attributesQueryDto)
    }

    @Patch(":attributeId")
    @ApiOperation({ summary: "Updates an attribute by ID" })
    @ApiConsumes("multipart/form-data")
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 400, description: [...AttributeErrorMessages.UPDATE_ATTRIBUTE, ...AttributeErrorMessages.ATTRIBUTE_PARAMS, ...ApiErrorMessages.MULTIPART_DATA, ApiErrorMessages.UNSUPPORTED_FILE_TYPE]})
    @ApiResponse({ status: 404, description: AttributeErrorMessages.ATTRIBUTE_NOT_FOUND})
    @ApiResponse({ status: 409, description: AttributeErrorMessages.MAIN_IMAGE_CONFLICT})
    @ApiResponse({ status: 200, type: AttributeResponseDto})
    @UseInterceptors(FileInterceptor("image", {
        fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"])
    }))
    async updateAttribute(@Param() attributeParamsDto: AttributeParamsDto, @Body() updateAttributeMultipartDto: UpdateAttributeMultipartDto, @UploadedFile() imageFile?: File) {
        const updateAttributeDto = updateAttributeMultipartDto.data || {}
        return await this.attributesService.updateAttribute(attributeParamsDto.attributeId, updateAttributeDto, imageFile)
    }

    @Delete(":attributeId")
    @ApiOperation({ summary: "Deletes an attribute by ID" })
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 400, description: AttributeErrorMessages.ATTRIBUTE_PARAMS})
    @ApiResponse({ status: 404, description: AttributeErrorMessages.ATTRIBUTE_NOT_FOUND})
    @ApiResponse({ status: 200, type: AttributeResponseDto})
    async deleteAttribute(@Param() attributeParamsDto: AttributeParamsDto) {
        return await this.attributesService.deleteAttribute(attributeParamsDto.attributeId)
    }
}