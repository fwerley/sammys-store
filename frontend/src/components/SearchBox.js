import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const submitHandler = (e) => {
        e.preventDefault()
        navigate(query ? `/search?query=${query}` : '/search')
    }

    return (
        <Form className='d-flex m-auto' onSubmit={submitHandler}>
            <InputGroup>
                <FormControl
                    type="text"
                    name="q"
                    id="q"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="pesquisar produto..."
                    aria-label="Pesquisar produtps"
                    aria-describedby="button-search"
                ></FormControl>
                <Button variant='outline-primary' type='submit' id='button-search'>
                    <i className='fas fa-search'/>
                </Button>
            </InputGroup>
        </Form>
    )
}
