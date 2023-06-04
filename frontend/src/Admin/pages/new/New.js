import { useState } from 'react';
import './new.scss';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

export default function New({ title, inputs }) {

    const [file, setFile] = useState("");

    return (
        <div className="new">
            <div className="newContainer">
                <div className="top">
                    <h1 className="title">{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="No image" />
                    </div>
                    <div className="right">
                        <form>
                            <div className="formInput">
                                <label htmlFor='file'>
                                    Imagem: <DriveFolderUploadIcon className='icon' />
                                </label>
                                <input
                                    type="file"
                                    id='file'
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input type={input.type} placeholder={input.placeholder} />
                                </div>
                            ))}
                            <button>Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
