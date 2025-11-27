export function hasNumber(word: string) {
    const digitRegex = /\d/
    return digitRegex.test(word)
}

export function isUpTo8Characters(word: string) {
    const trimmedWord = word.trim()
    return trimmedWord.length >= 8
}

export function hasSpecialCharacter(word: string) {
    // Regular expression to match any non-alphanumeric character (excluding space)
    const specialCharRegex = /[^a-zA-Z0-9\s]/
    return specialCharRegex.test(word)
}

export function hasUppercase(word: string) {
    const uppercaseRegex = /[A-Z]/
    return uppercaseRegex.test(word)
}

export function areAllValuesPresent(obj: any) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
                return false
            }
        }
    }
    return true
}
