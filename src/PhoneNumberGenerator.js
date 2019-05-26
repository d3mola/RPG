class PhoneNumberGenerator {
    constructor(cache) {
        this.cache = cache;
    }

    generatePhoneNumber(options) {
        let min = 100000000;
        let max = 999999999;

        return 0 + `${Math.random() * (max - min) + min}`.substring(0, 9);
    }

    generatePhoneNumbers(amountToGenerate = 500) {
        let numbers = [];
        let i = 0;

        while (i < amountToGenerate) {
            const number = this.generatePhoneNumber();
            const numberDoesNotExist = !(number in this.cache);
            if (numberDoesNotExist) {
                this.cache[number] = 1;
                numbers.push(number);
                i++;
            }
        }

        console.log("cache len: ", Object.keys(this.cache).length);
        

        return numbers;
    }

    hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }
}

module.exports = PhoneNumberGenerator;
