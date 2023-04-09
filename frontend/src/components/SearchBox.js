import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Search } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { selectProducts } from '../slice/productsSlice';
import { useSelector } from 'react-redux';

export default function SearchBox({eventCollapse}) {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const { categories } = useSelector(selectProducts);
    let [query, setQuery] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        eventCollapse(false)
        if (category) query = `${query}&category=${category}`
        navigate(query ? `/search?query=${query}` : '/search')
    }

    return (
        <Form className='d-flex m-auto' onSubmit={submitHandler}>
            <InputGroup>
                <FormControl
                    className='search-area'
                    type="search"
                    name="q"
                    id="q"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Produto, marca, categori..."
                    aria-label="Pesquisar produtos"
                    aria-describedby="button-search"
                ></FormControl>
                <Form.Select
                    size="sm"
                    aria-label="Selecionar categorias"
                    className='search-category'
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="all">Todas as categorias</option>
                    {categories.map((item, index) => (
                        <option key={index} value={item.category}>{item.category}</option>
                    ))}
                </Form.Select>
                <Button variant='outline-primary' type='submit' id='button-search'>
                    <Search />
                </Button>
            </InputGroup>
        </Form>
    )
}
