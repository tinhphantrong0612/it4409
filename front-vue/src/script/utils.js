export const utils = {
    toVND(money) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
    },
    toDDMMYYYY(date) {
        const theDate = new Date(date);
        const day = theDate.getDate() < 10 ? `0${theDate.getDate()}` : theDate.getDate();
        const month = theDate.getMonth() < 9 ? `0${theDate.getMonth() + 1}` : theDate.getMonth() + 1;
        const year = theDate.getFullYear();
        return `${day}/${month}/${year}`;
    },
    toHHMMDDMMYYYY(date) {
        const theDate = new Date(date);
          const day = theDate.getDate() < 10 ? `0${theDate.getDate()}` : theDate.getDate();
          const month = theDate.getMonth() < 9 ? `0${theDate.getMonth() + 1}` : theDate.getMonth() + 1;
          const year = theDate.getFullYear();
          const hour = theDate.getHours() < 10 ? `0${theDate.getHours()}` : theDate.getHours();
          const minute = theDate.getMinutes() < 10 ? `0${theDate.getMinutes()}` : theDate.getMinutes();
          return `${hour}:${minute} ${day}/${month}/${year}`;
    }
}