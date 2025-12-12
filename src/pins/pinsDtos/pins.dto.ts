// src/pins/pinsDtos/pins.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ArrayNotEmpty, IsArray, IsOptional, IsString, IsUrl, IsUUID, Length, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { HashtagDto } from './hashtag.dto';

export class pinsDto {
  
  @ApiProperty({ example: 'https://res.cloudinary.com/.../image.jpg' })
  @IsUrl({}, { message: 'Image has to be a valid URL' })
  image: string;

  @ApiProperty({ example: 'Amazing interior inspiration', minLength: 3, maxLength: 200 })
  @IsString({ message: 'Desciption must be a string' })
  @Length(3, 200, { message: 'Description must be between 3 and 200 characters' })
  description: string;

  @ApiProperty({ example: '5c20797c-5c07-42be-8cda-18cc063e8b3c', format: 'uuid' })
  @IsUUID('4', { message: 'ID category must be a valid UUID' })
  categoryId: string;

  @ApiPropertyOptional({ example: ['photography', 'nature', 'art'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];  // ✅ Array de strings, NO objetos

}
export class updateDto extends PartialType(pinsDto) {}
