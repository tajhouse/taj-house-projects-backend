import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const existingContact = await this.contactModel.findOne({
      email: createContactDto.email,
      createdAt: { 
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
      }
    });

    if (existingContact) {
      throw new BadRequestException('You have already submitted a request in the last 24 hours');
    }

    const contact = new this.contactModel(createContactDto);
    return contact.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: Contact[],
    total: number,
    page: number,
    totalPages: number
  }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.contactModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.contactModel.countDocuments()
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findByStatus(status: string, page: number = 1, limit: number = 10): Promise<{
    data: Contact[],
    total: number,
    page: number,
    totalPages: number
  }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.contactModel
        .find({ status })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.contactModel.countDocuments({ status })
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findUnread(): Promise<Contact[]> {
    return this.contactModel
      .find({ isRead: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactModel.findById(id);
    if (!contact) {
      throw new NotFoundException(`Contact request with id ${id} not found`);
    }
    return contact;
  }

  async updateStatus(id: string, updateStatusDto: UpdateContactStatusDto): Promise<Contact> {
    const contact = await this.contactModel.findByIdAndUpdate(
      id,
      updateStatusDto,
      { new: true }
    );

    if (!contact) {
      throw new NotFoundException(`Contact request with id ${id} not found`);
    }

    return contact;
  }

  async markAsRead(id: string): Promise<Contact> {
    return this.updateStatus(id, { isRead: true });
  }

  async remove(id: string): Promise<void> {
    const result = await this.contactModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Contact request with id ${id} not found`);
    }
  }

  async getStats(): Promise<{
    total: number,
    pending: number,
    inProgress: number,
    completed: number,
    unread: number
  }> {
    const [total, pending, inProgress, completed, unread] = await Promise.all([
      this.contactModel.countDocuments(),
      this.contactModel.countDocuments({ status: 'pending' }),
      this.contactModel.countDocuments({ status: 'in-progress' }),
      this.contactModel.countDocuments({ status: 'completed' }),
      this.contactModel.countDocuments({ isRead: false }),
    ]);

    return { total, pending, inProgress, completed, unread };
  }
}
