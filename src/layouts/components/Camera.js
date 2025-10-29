import { useState, useEffect, Fragment, useCallback } from 'react'
import CameraPhoto, {FACING_MODES, IMAGE_TYPES} from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import ImagePreview from './ImagePreview'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const CameraComponent = ({onTake, ...res}) => {

    // ** State
    const [dataUri, setDataUri] = useState(null)

    function handleTakePhoto (uri) {
        // Do stuff with the photo...
        console.log('takePhoto')
        setTimeout(() => {
            setDataUri(uri)
            onTake(uri)
        }, 100)
    }

    return (
        <Modal
            {...res}
            className={`modal-dialog-centered modal-lg`}
        >
            <ModalHeader>
              Take Photo
            </ModalHeader>
            <ModalBody>
            { 
                (dataUri) ? (
                    <ImagePreview dataUri={dataUri} />
                ) : res.isOpen && (
                    <CameraPhoto
                        onTakePhoto = { (uri) => { handleTakePhoto(uri) } }
                        idealFacingMode = {FACING_MODES.ENVIRONMENT}
                        idealResolution = {{width: 640, height: 480}}
                        imageType = {IMAGE_TYPES.JPG}
                        isMaxResolution = {true}
                        isImageMirror = {false}
                        isSilentMode = {false}
                        isDisplayStartCameraError = {true}
                        sizeFactor = {1}
                    />
                )
            }
            </ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => res.toggle(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => setDataUri(null)}>Re-take</button>
            </ModalFooter>
        </Modal>
    )
}

export default CameraComponent