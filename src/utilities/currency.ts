export default function formatToNepaliCurrency(number: number) {
    const formatter = new Intl.NumberFormat('NP', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return 'Rs. ' + formatter.format(number);
}