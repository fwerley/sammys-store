import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { formatHour, formatedDate } from '../utils'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LoadingBox from './LoadingBox'
import MessageBox from './MessageBox'

export default function TrackOrder({ code }) {
    const [status, setStatus] = useState([])
    const [resume, setResume] = useState(true)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchData = async () => {
        try {
            const { data } = await axios.get(`/api/correios/${code}`)
            setStatus(data);
            setLoading(false)
        } catch (error) {
            setLoading(false);
            setError('Não foi possivel buscar os dados no momento')
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <div className='track-info mt-2'>
            {loading ?
                <LoadingBox />
                : error ?
                    <MessageBox>
                        {error}
                    </MessageBox>
                    :
                    status.map((item, i) => {
                        return (
                            <Row key={i} className='mb-1'>
                                {
                                    i < 2 || i === (status.length - 1) && resume ? (
                                        <>
                                            <Col md={1} xs={2} sm={2}>
                                                <img src={`https://rastreamento.correios.com.br/static/rastreamento-internet/imgs/${item.urlIcone.split('/').pop()}`} />
                                            </Col>
                                            <Col md={11} xs={10} sm={10}>
                                                <strong>{item.descricao}</strong><br />
                                                {item.unidade.nome || item.unidade.endereco.cidade}{item.unidade.endereco.uf && ` - ${item.unidade.endereco.uf}`}<br />
                                                {formatedDate(item.dtHrCriado)} {formatHour(item.dtHrCriado).slice(0, 5)}
                                            </Col>
                                        </>
                                    ) : resume && i === 2 ? (
                                        <Col md={1} xs={2}>
                                            . . .
                                            <Button type='button' className='shadow' onClick={() => setResume(false)}>
                                                <i className="fas fa-expand" />
                                            </Button>
                                            . . .
                                        </Col>
                                    ) : !resume ?
                                        <>
                                            <Col md={1} xs={2} sm={2}>
                                                <img src={`https://rastreamento.correios.com.br/static/rastreamento-internet/imgs/${item.urlIcone.split('/').pop()}`} />
                                            </Col>
                                            <Col md={11} xs={10} sm={10}>
                                                <strong>{item.descricao}</strong><br />
                                                {item.unidade.nome || item.unidade.endereco.cidade}{item.unidade.endereco.uf && ` - ${item.unidade.endereco.uf}`}<br />
                                                {formatedDate(item.dtHrCriado)} {formatHour(item.dtHrCriado).slice(0, 5)}
                                            </Col>
                                        </>
                                        : ''
                                }
                            </Row>
                        )
                    }
                    )}
            {!resume ?
                (
                    <Row>
                        <Col md={1}>
                            <Button type='button' className='shadow' onClick={() => setResume(true)}>
                                <i className="fas fa-compress" />
                            </Button>
                        </Col>
                    </Row>
                )
                : ''}
        </div>
    )
}
