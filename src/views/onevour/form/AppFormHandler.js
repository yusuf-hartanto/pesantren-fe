class AppFormHandler {

    constructor(component, props) {
        this.component = component
        this.props = props
    }

    isUpdate(key) {
        return (this.component.props[key] !== this.props[key])
    }

    value(key) {
        return this.props[key]
    }

}

export default AppFormHandler