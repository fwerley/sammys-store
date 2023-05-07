import { Fragment, useCallback, useState } from "react"
import { getOrientation } from 'get-orientation/browser'
import Cropper from 'react-easy-crop'
import { getCroppedImage, getRotatedImage } from "../../canvasUtils"
import './index.css'
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import RangeSlider from 'react-bootstrap-range-slider';

const ORIENTATION_TO_ANGLE = {
    '3': 180,
    '6': 90,
    '8': -90,
}

export default function CropImage({ uploadFile }) {
    const [imageSrc, setImageSrc] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImage(
                imageSrc,
                croppedAreaPixels,
                rotation
            )
            // console.log('donee', { croppedImage })
            setCroppedImage(croppedImage)
            uploadFile(croppedImage)
        } catch (error) {
            console.error(error)
        }
    }, [imageSrc, croppedAreaPixels, rotation])

    const onClose = useCallback(() => {
        setCroppedImage(null)
    }, [])

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await readFile(file)

            try {
                const orientation = await getOrientation(file)
                const rotation = ORIENTATION_TO_ANGLE[orientation]
                if (rotation) {
                    imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
                }
            } catch (error) {
                console.warn('failed to detect the orientation')
            }

            setImageSrc(imageDataUrl)
        }
    }

    const onSubmitImage = () => {        
        showCroppedImage();        
        onClose()
        setImageSrc(null)
    }

    const onCancel = () => {
        onClose()
        setImageSrc(null)
    }

    return (
        <div>
            {imageSrc ? (
                <div className="viewCrop">
                    {document.documentElement.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth", // Optional if you want to skip the scrolling animation
                    })}
                    <div className="cropContainer">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            aspect={1 / 1}
                            onCropChange={setCrop}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="d-flex m-1 mx-4 gap-2 justify-content-between align-items-center controls">

                        <div className='d-flex flex-column'>
                            Rotacionar
                            <RangeSlider
                                min={0}
                                max={360}
                                tooltip="on"
                                tooltipLabel={() => rotation + '°'}
                                step={1}
                                size="sm"
                                value={rotation}
                                onChange={(e) => setRotation(e.target.value)}
                            />
                        </div>
                        <div className='d-flex gap-2'>
                            <Button variant="light" onClick={onCancel}>Cancelar</Button>
                            <Button type='button' onClick={onSubmitImage}>Salvar imagem</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <Form.Control
                    type='file'
                    onChange={onFileChange}
                    accept="image/*"
                />

                // <input type="file" onChange={onFileChange} name="image" id="" accept="image/*" />
            )}
        </div>
    )

    function readFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }
}
