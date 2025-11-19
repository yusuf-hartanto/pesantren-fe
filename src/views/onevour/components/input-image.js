import React, {useRef, useState} from "react";

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

const InputImage = props => {
    // ** Props
    const {data, name, selected, gridProps, handleChange, color = 'grey'} = props

    const {alt, img, value} = data

    const [file, setFile] = useState(null)

    const hiddenFileInput = useRef(null);

    //
    const getBase64 = (file) => {
        return new Promise(resolve => {
            let fileInfo;
            let baseURL = "";

            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {
                baseURL = reader.result;

                //console.log(baseURL);

                resolve(baseURL);
            }

            //console.log(fileInfo);
        })
    }

    // trigger open dialog

    const handleClick = event => {
        hiddenFileInput.current.click()
    }

    const handleChangeFile = event => {
        const fileUploaded = event.target.files[0];

        setFile(fileUploaded)
        getBase64(fileUploaded).then(r => {

            handleChange(r)
        })

        //Promise(file => ).then(imageBase64 => {
        //const img = await
        //     console.log(img)
        //})

        // handleFile(fileUploaded);
    }

    const renderFilePreview = file => {
        if (file.type.startsWith('image')) {
            return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)}/>
        } else {
            return <i className="tabler-file-description"/>
        }
    }

    const renderComponent = () => {
        return (
            <Grid item {...gridProps}>
                <Box
                    onClick={handleClick}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        borderRadius: 1,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: theme => `2px solid ${theme.palette.divider}`,
                        '& img': {
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        },
                        ...(selected.includes(value)
                            ? {borderColor: `${color}.main`}
                            : {
                                '&:hover': {borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)`},
                                '&:not(:hover)': {
                                    '& .MuiCheckbox-root': {display: 'none'}
                                }
                            })
                    }}
                >
                    {typeof img === 'string' && !file ? <img src={img} alt={alt ?? `checkbox-image-${value}`}/> : null}
                    {file ? renderFilePreview(file) : null}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleChangeFile}
                        ref={hiddenFileInput}
                        style={{display: 'none'}} // Make the file input element invisible
                    />
                </Box>
            </Grid>
        )
    }

    return data ? renderComponent() : null
}

export default InputImage
