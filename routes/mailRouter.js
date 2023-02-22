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
        const { customerName, customerPhone, customerMail } = req.body;

        const mailOptions = {
            from: `${process.env.EMAIL_ADRESS}`,
            to: `${process.env.EMAIL_ADRESS}`,
            subject: 'Новый заказ',
            text: `Пробный заказ, имя: ${customerName}, номер: ${customerPhone} ${customerMail}`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log('error here', error);
            } else {
                return res.send({ code: 200, message: 'Заказ успешно оформлен, ожидайте звонка, в ближайшее время с вами свяжется менеджер для подтверждения заказа.' }); // Тут нотификация об успешном заказе.
            }
        });
    } catch (error) {
        console.log(error); // Нотификация об неуспешной отправке письма.
    }
});

export default router;
