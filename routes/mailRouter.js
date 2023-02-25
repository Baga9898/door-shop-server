import { Router }  from "express";
import * as dotenv from 'dotenv';
import nodemailer  from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
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

        let message = (`<p>
            Имя: ${customerName}; <br/>
            Контактный номер: ${customerPhone}; <br/>
            Почта: ${customerMail};
        </p>`);

        message += (
            '<table style="border: 1px solid #333">' +
                '<thead>' +
                    '<th> article </th>' +
                    '<th> name </th>'  +
                    '<th> size </th>'  +
                    '<th> price </th>'  +
                    '<th> count </th>'  +
                '</thead>'
        ); 

        for(const { article, name, size, price, count } of doors) {
            message += (
                '<tr>' +
                    '<td>' + article + '</td>' +
                    '<td>' + name + '</td>' +
                    '<td>' + size + '</td>' +
                    '<td>' + price + '</td>' +
                    '<td>' + count + '</td>' +
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
                return res.send({ code: 200, message: 'Заказ успешно оформлен, ожидайте звонка, в ближайшее время с вами свяжется менеджер для подтверждения заказа.' }); // Тут нотификация об успешном заказе.
            }
        });
    } catch (error) {
        return res.send({ code: 400, message: 'Что - то пошло не так' });
    }
});

export default router;
