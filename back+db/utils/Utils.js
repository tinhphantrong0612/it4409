class Utils {
    static toSQLDate(date) {
        const theDate = new Date(date);
        const day = theDate.getDate() < 10 ? `0${theDate.getDate()}` : theDate.getDate();
        const month = theDate.getMonth() < 9 ? `0${theDate.getMonth() + 1}` : theDate.getMonth() + 1;
        const year = theDate.getFullYear();
        
        return `${year}-${month}-${day}`;
    }
}

module.exports = Utils;