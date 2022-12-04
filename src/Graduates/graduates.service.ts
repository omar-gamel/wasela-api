import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class GraduatesService {
    constructor(private readonly prisma: PrismaService) { }

    private async findGraduated(studentId: string) {
        const graduates = await this.graduates();
        return graduates.find(graduated => graduated.student.id.toString() === studentId.toString());
    };

    async addGraduated(studentId: string) {
        try {
            const student = await this.prisma.users.findOne({ where: { id: studentId } });
            if (!student)
                throw new HttpException('Student not found', HttpStatus.NOT_FOUND);

            let graduated = await this.findGraduated(studentId);
            if (!graduated) {
                graduated = await this.prisma.graduates.create({
                    data: { student: { connect: { id: student.id } } }, include: { student: true }
                });
            } else {
                return { code: 201, message: 'Student already added', success: false, graduated };
            }
            return { code: 201, message: 'Graduates updated successfully', success: true, graduated };
        } catch (error) {
            throw error;
        }
    };

    async removeGraduated(studentId: string) {
        try {
            let graduated = await this.findGraduated(studentId);
            if (!graduated)
                throw new HttpException('Student not exists in graduates', HttpStatus.NOT_FOUND);

            await this.prisma.graduates.delete({ where: { id: graduated.id } });
            return { code: 201, message: 'Graduated removed successfully', success: true, graduated };
        } catch (error) {
            throw error;
        }
    };

    async graduates() {
        return await this.prisma.graduates.findMany({
            include: { student: true }
        });
    };
}

