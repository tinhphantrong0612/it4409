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
            }
        }
    }
}