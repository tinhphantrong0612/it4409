export const store = {
    state: {
        loading: false,
        currentOrigin: ""
    },
    get mutate() {
        return {
            UPDATE_LOADING: (loading) => {
                this.state.loading = loading;
            },
            UPDATE_CURRENTORIGIN: (origin) => {
                this.state.currentOrigin = origin;
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
            setCurrentOrigin: (origin) => {
                this.mutate.UPDATE_CURRENTORIGIN(origin);
            },
            /**
             * Lấy danh sách đối tượng nào đó từ server
             * @param {String} thing Danh sách cần lấy, ví dụ: supplierList -> thing = supplier
             */
            getListOfThing: async (thing) => {
                const response = await fetch(`${this.state.currentOrigin}/api/${thing}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                return data;
            }
        }
    }
}