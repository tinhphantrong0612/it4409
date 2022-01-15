export const store = {
    state: {
        loading: false
    },
    get mutate() {
        return {
            UPDATE_LOADING: (loading) => {
                this.state.loading = loading;
            }
        }
    },
    get action() {
        return {
            showLoading: () => {
                this.mutate.UPDATE_LOADING(true);
            },
            hideLoading: () => {
                this.mutate.UPDATE_LOADING(false);
            },            
            /**
             * Lấy danh sách đối tượng nào đó từ server
             * @param {String} thing Danh sách cần lấy, ví dụ: supplierList -> thing = supplier
             */
            getListOfThing: async (thing) => {
                const response = await fetch(`${this.$currentOrigin}/api/${thing}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                return data;
            }
        }
    }
}