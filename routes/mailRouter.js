import { Router }  from "express";
import * as dotenv from 'dotenv';
import nodemailer  from 'nodemailer';

import { errorMessage } from "../constants.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const router = new Router();
const basePath = '/mail';

router.post(`${basePath}`, (req, res) => {
    try {
        const { customerName, customerPhone, customerMail, doors } = req.body;

        let message = (
            `<p>
                Имя: ${customerName}; <br/>
                Контактный номер: ${customerPhone}; <br/>
                Почта: ${customerMail};
            </p>`
        );

        message += (
            '<table style="border: 1px solid #333">' +
                '<thead>' +
                    '<th> Артикул </th>' +
                    '<th> Наименование </th>'  +
                    '<th> Размер </th>'  +
                    '<th> Цена </th>'  +
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
            from: `${process.env.EMAIL_ADRESS}`,
            to: `${process.env.EMAIL_ADRESS}`,
            subject: 'Новый заказ', // На фронте добавить номер заказа, здесь его вытаскивать и отправлять в заголовке письма.
            html: message,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log('error here', error);
            } else {
                return res.send({ code: 200 });
            }
        });
    } catch (error) {
        return res.send({ code: 400, message: errorMessage });
    }
});

export default router;
