const dateFormatter = date => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const ordinaryNumber = number => {
        const position = ["st", "nd", "rd"];
        if (!number)
            return null;
        else if (number % 100 >= 11 && number % 100 <= 13)
            return `${number}th`;
        else if (number % 10 >= 1 && number % 10 <= 3)
            return `${number}${position[(number % 10) - 1]}`;
        else
            return `${number}th`;
    }

    const formattedDate = `${months[date.getMonth()]} ${ordinaryNumber(date.getDate())}, ${date.getFullYear()}`;
    return formattedDate;
}

module.exports = dateFormatter;