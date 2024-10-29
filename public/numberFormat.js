const { default: BigNumber } = require("bignumber.js");
var bigNumber = require("bignumber.js");

const prefixes = [
    { symbol: 'NTR', factor: '1e123' }, 
    { symbol: 'OTR', factor: '1e120' }, 
    { symbol: 'sTR', factor: '1e117' },
    { symbol: 'STR', factor: '1e114' }, 
    { symbol: 'qTR', factor: '1e111' }, 
    { symbol: 'QTR', factor: '1e108' },
    { symbol: 'TTR', factor: '1e105' }, 
    { symbol: 'DTR', factor: '1e102' },
    { symbol: 'UTR', factor: '1e99' }, 
    { symbol: 'Tr', factor: '1e96' }, 
    { symbol: 'NV', factor: '1e93' }, 
    { symbol: 'OV', factor: '1e90' }, 
    { symbol: 'sV', factor: '1e87' },
    { symbol: 'Sp', factor: '1e84' }, 
    { symbol: 'SV', factor: '1e81' }, 
    { symbol: 'qV', factor: '1e78' },
    { symbol: 'QV', factor: '1e75' }, 
    { symbol: 'TV', factor: '1e72' },
    { symbol: 'DV', factor: '1e69' }, 
    { symbol: 'UV', factor: '1e66' }, 
    { symbol: 'V', factor: '1e63' }, 
    { symbol: 'ND', factor: '1e60' }, 
    { symbol: 'OD', factor: '1e57' },
    { symbol: 'sD', factor: '1e54' }, 
    { symbol: 'SD', factor: '1e51' }, 
    { symbol: 'qD', factor: '1e48' },
    { symbol: 'QD', factor: '1e45' }, 
    { symbol: 'TD', factor: '1e42' },
    { symbol: 'DD', factor: '1e39' }, 
    { symbol: 'UD', factor: '1e36' }, 
    { symbol: 'D', factor: '1e33' }, 
    { symbol: 'N', factor: '1e30' }, 
    { symbol: 'O', factor: '1e27' },
    { symbol: 's', factor: '1e24' }, 
    { symbol: 'S', factor: '1e21' }, 
    { symbol: 'q', factor: '1e18' },
    { symbol: 'Q', factor: '1e15' }, 
    { symbol: 'T', factor: '1e12' },
    { symbol: 'B', factor: '1e9' }, 
    { symbol: 'M', factor: '1e6' }, 
];

function convertToMetricPrefixes(number) {
    for (let i = 0; i < prefixes.length; i++) {
        if (number >= prefixes[i].factor) {
            return (number / prefixes[i].factor).toFixed(2) + prefixes[i].symbol;
        }
    }

    return formatNumberWithSpaces(number); // No recognized number.toString(); // Less than million, return as is
}

function convertToRegularNumber(number) {
    return formatNumberWithSpaces(number);
}

function formatNumberWithSpaces_(number) {
    // Create a NumberFormat instance with US locale and custom pattern
    let decimalFormat = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3
    });

    // Format the number with commas for thousands separators
    let formattedNumber = decimalFormat.format(number);

    // Replace commas with spaces
    formattedNumber = formattedNumber.replace(/,/g, ' ');

    return formattedNumber;
}

function toScientificNotationFromString(numString) {
    let n = new bigNumber(numString)

    if (n.isLessThan(new bigNumber(1e6))){
        return formatNumberWithSpaces(numString)
    }
     // Check if the string is a valid number using a regular expression
     if (!/^[+-]?(\d+)(\.\d+)?$/.test(numString)) {
        console.log("Invalid number format (We will fix this later)")
        return false;
     }
     
     // Find the position of the decimal point (if any)
     let decimalIndex = numString.indexOf('.');
     
     // If there's no decimal point, treat it as an integer
     if (decimalIndex === -1) {
         decimalIndex = numString.length;
     }
     
     // Remove the decimal point for easier manipulation
     let cleanNumber = numString.replace('.', '');
     
     // Find the first non-zero digit
     let firstNonZero = cleanNumber.search(/[1-9]/);
     
     if (firstNonZero === -1) {
         return "0";  // If no non-zero digits are found, the number is 0
     }
     
     // Move the decimal to after the first non-zero digit
     let mantissa = cleanNumber[firstNonZero];
     
     // Append all the remaining digits after the first non-zero digit
     if (firstNonZero + 1 < cleanNumber.length) {
         mantissa += cleanNumber.slice(firstNonZero + 1);
     }
     
     // Calculate the exponent
     let exponent = decimalIndex - firstNonZero - 1;
     
     // Construct the full scientific notation (e.g., "864910040800000e14")
     let fullScientificNotation = `${mantissa}e${exponent}`;
     
    // Shorten the mantissa manually (to retain up to 4 significant digits)
    let formattedMantissa = mantissa.slice(0, 4);
    
    // If there are more than one digit, insert a decimal after the first digit
    if (formattedMantissa.length > 1) {
        formattedMantissa = formattedMantissa[0] + '.' + formattedMantissa.slice(1);
    }
    
    // Format the exponent by removing the "+" sign if positive
    let formattedExponent = (exponent >= 6) ? `e${exponent}` : ``;
    
    // Construct the shortened scientific notation (e.g., "8.649e14")
    let shortenedScientificNotation = `${formattedMantissa}${formattedExponent}`;
    
    // Return both the full and shortened scientific notations
    return shortenedScientificNotation
}

function formatNumberWithSpaces(numberString) {
    // Trim any leading or trailing whitespace
    numberString = numberString.trim();

    // Check if the string is a valid number format (supports integers and decimals)
    if (!/^[+-]?(\d+)(\.\d+)?$/.test(numberString)) {
        console.log("Invalid number format");
        return false;
    }

    // Split the number into integer and decimal parts
    let [integerPart, decimalPart] = numberString.split('.');

    // Add spaces as thousands separators to the integer part
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Recombine the integer and decimal parts (if any)
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

function convertToMetricPrefixes(numberString) {
    // Check if the string is a valid number
    if (!/^[+-]?(\d+)(\.\d+)?$/.test(numberString)) {
        return "Invalid number format";
    }

    const n = parseFloat(numberString)

    if (n < 1e6){
        return convertToRegularNumber(numberString)
    }

    // Loop through prefixes
    for (let i = 0; i < prefixes.length; i++) {
        const exponent = parseFloat(prefixes[i].factor.split('e')[1]);
        const prefixValue = Math.pow(10, exponent);

        // If the number is greater than or equal to the current prefix value
        if (n >= prefixValue) {
            const formattedValue = (n / prefixValue).toFixed(2); // Format to 2 decimal places
            return `${formattedValue} ${prefixes[i].symbol}`;
        }
    }

    // Return the original number if no prefix is suitable
    return numberString;
}

module.exports = {
    toScientificNotationFromString,
    formatNumberWithSpaces,
    convertToMetricPrefixes,
}