/**
 * invitation service
 */

module.exports = {
    sendMail: async (email: string, subject: string, body: string): Promise<void> => {
        console.log("fake sending mail to", email);
    }
}