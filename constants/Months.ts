export const MONTHS_ORDER = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
]

export const MONTH_TO_NUM_STRING = (month: string) => {

    const monthIndex = MONTHS_ORDER.findIndex(monthEle => monthEle == month)
    if (monthIndex == -1) {
        return null
    }
    let monthString;
    if (monthIndex < 10) {
        monthString = '0' + monthIndex
    } else {
        monthString = monthIndex.toString()
    }
    return monthString
}