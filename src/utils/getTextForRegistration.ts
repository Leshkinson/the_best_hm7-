

export const getTextForRegistration = (code: string) => {
    const href = `https://somesite.com/confirm-email?code=${code}`
    return "<h1>Thank for your registration</h1>\n" +
        `${code}` //удалить
        +
        "       <p>My code(generatedCode) To finish registration please follow the link below:\n" +
        "          <a href={href}>complete registration</a>\n" +
        "      </p>"
}