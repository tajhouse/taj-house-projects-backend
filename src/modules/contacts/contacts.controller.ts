import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  
  async create(@Body() createContactDto: CreateContactDto) {
    const contact = await this.contactsService.create(createContactDto);
    return {
      success: true,
      message: 'Your request has been submitted successfully. We will contact you soon!',
      data: {
        id: contact._id,
        submittedAt: contact.createdAt
      },
    };
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    let result;
    if (status) {
      result = await this.contactsService.findByStatus(status, pageNum, limitNum);
    } else {
      result = await this.contactsService.findAll(pageNum, limitNum);
    }

    return {
      success: true,
      message: 'Contact requests fetched successfully',
      ...result,
    };
  }

  @Get('unread')
  async findUnread() {
    const contacts = await this.contactsService.findUnread();
    return {
      success: true,
      message: 'Unread contacts fetched successfully',
      data: contacts,
      count: contacts.length,
    };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.contactsService.getStats();
    return {
      success: true,
      message: 'Contact statistics fetched successfully',
      data: stats,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contact = await this.contactsService.findOne(id);
    
    // تحديد كمقروء عند فتح الطلب
    if (!contact.isRead) {
      await this.contactsService.markAsRead(id);
      contact.isRead = true;
    }

    return {
      success: true,
      message: 'Contact request fetched successfully',
      data: contact,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateContactStatusDto
  ) {
    const contact = await this.contactsService.updateStatus(id, updateStatusDto);
    return {
      success: true,
      message: 'Contact status updated successfully',
      data: contact,
    };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    const contact = await this.contactsService.markAsRead(id);
    return {
      success: true,
      message: 'Contact marked as read',
      data: contact,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.contactsService.remove(id);
    return {
      success: true,
      message: 'Contact request deleted successfully',
    };
  }
}
