import {debugFormMode} from "./AppFormValidation";

class AppForm {

    constructor(form, event = null, fields=[]) {
        this.form = form
        this.fields = fields
        this.store = {error_form: false}
        if (event != null) event.preventDefault()
    }

    errorMessage() {
        const store = this.store
        let message = null;

        Object.keys(store).forEach(function (key, index) {
            if (key.endsWith("_error")) {
                let tmp = store[key]

                if (null === message && (undefined !== tmp || tmp !== "" || tmp.length !== 0)) {
                    message = tmp
                }
            }
        })

        return message == null ? "Please check field input" : message
    }

    errorMessageClear(fields = []) {
        let store = this.store

        Object.keys(store).forEach(function (key, index) {
            if (key.endsWith("_error")) {
                store[key] = null
            }
        });

        for (let i = 0; i < fields; i++) {
            delete store[fields[i]]
        }

        store.request = true

        return this.store
    }

    isError() {
        if (this.store.error_form) {
            return true
        }

        this.errorMessageClear()

        return false
    }

    validateEmpty(keys = [], message = "Please input field!", min = 0, max = 0) {
        const state = this.form.state

        keys.forEach(key => {
            console.log("key", key)
            let value = state[key]

            console.log("validate field", key, value)
            let errorKey = key + "_error"

            if (debugFormMode) console.log("validate", key, value)

            if (undefined === value || null === value || value.length === 0) {
                this.store.error_form = true
                this.store[errorKey] = message
                console.log(this.store)
                this.form.setState(this.store)
                if (debugFormMode) console.log(this.store)

                return
            }

            if (min > 0 && value.length < min) {
                this.store.error_form = true
                this.store[errorKey] = message
                this.form.setState(this.store)
                if (debugFormMode) console.log(this.store)

                return
            }

            if (max > 0 && value.length > max) {
                this.store.error_form = true
                this.store[errorKey] = message
                this.form.setState(this.store)
                if (debugFormMode) console.log(this.store)

                return
            }

            this.store[errorKey] = null
            if (debugFormMode) console.log("clear error", errorKey)
        })
    }

    validateEmail(key) {
        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let value = this.state[key]
        let errorKey = key + "_error"

        if (debugFormMode) console.log("validate ", value)

        if (!regEmail.test(value)) {
            this.store.error_form = true
            this.store[errorKey] = "Please input valid email"
            this.form.setState(this.store)
            if (debugFormMode) console.log(this.store)

            return
        }

        this.store[errorKey] = null
        if (debugFormMode) console.log("clear error", errorKey)
    }

    param() {
        this.errorMessageClear()
        const copy = {}

        this.fields.forEach(o => {
            copy[o] = this.form.state[o]
        })

        return copy
    }
}

export default AppForm;
