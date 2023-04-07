import { Router }  from "express";
import * as dotenv from 'dotenv';
import nodemailer  from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'hotmail', // В константы.
    port: 587,
    auth: {
        user: process.env.EMAIL_FROM_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const router = new Router();
const basePath = '/mail'; // В константы.

router.post(`${basePath}`, (req, res) => {
    try {
        const { customerName, customerPhone, customerMail, doors } = req.body;

        let message = (
            `<p>
                Имя: ${customerName}; <br/>
                Контактный номер: ${customerPhone}; <br/>
                Почта: ${customerMail || 'Пользователь не указал почту'};
            </p>`
        );

        message += (
            '<table style="border: 1px solid #333">' +
                '<thead>' +
                    '<th> Артикул </th>' +
                    '<th> Наименование </th>'  +
                    '<th> Размер </th>'  +
                    '<th> Цена за штуку </th>'  +
                    '<th> Количество </th>'  +
                    '<th> Направление </th>'  +
                '</thead>'
        ); 

        for(const { article, name, size, price, count, direction } of doors) {
            message += (
                '<tr>' +
                    '<td>' + article + '</td>' +
                    '<td>' + name + '</td>' +
                    '<td>' + size + '</td>' +
                    '<td>' + price + '</td>' +
                    '<td>' + count + '</td>' +
                    '<td>' + direction + '</td>' +
                '</tr>'
            );
        };

        message += '</table>';

        const mailOptions = {
            from: `${process.env.EMAIL_FROM_ADRESS}`,
            to: `${process.env.EMAIL_TO_ADRESS}`,
            subject: 'Новый заказ', // На фронте добавить номер заказа, здесь его вытаскивать и отправлять в заголовке письма.
            html: message,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log('Send mail error', error); // В константы.
            } else {
                return res.send({ code: 200 });
            }
        });
    } catch (error) {
        return res.send({ code: 400, error});
    }
});

export default router;
