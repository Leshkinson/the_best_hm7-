

export const getTextForRegistration = (generatedCode: string) => {
    return "<h1>Thank for your registration</h1>\n" +
        `${generatedCode}` //удалить
        +
        "       <p> To finish registration please follow the link below:\n" +
        "          <a href='https://somesite.com/confirm-email?code=${generatedCode}'>complete registration</a>\n" +
        "      </p>"
}