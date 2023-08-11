
import { useState } from 'react';
import { useContext } from 'react';
import { ToDoContext } from './ToDoList';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { Textarea } from '@mui/joy';
import {Button} from '@mui/material'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


function SearchForm() {

    
    const {rows, setRows, pages, setPages, currentPage, setCurrentPage, urlParams, setUrlParams, baseuri, setBaseUri, averageTime}  = useContext(ToDoContext);

    const [search, setSearch] = useState('');
    const [priority, setPriority] = useState('All');
    const [status, setStatus] = useState('All');

    function handleClick(){
        setUrlParams(
            {
                filterName: search,
                filterPriority: priority,
                filterDone:status,
            }
        );
        setSearch('');

    }

    function handlePriorityChange(e, value) {
        setPriority(value);
    }
    function handleStatusChange(e, value) {
        setStatus(value);
    }
    function handleTextareaChange(e) {
        setSearch(e.target.value);
    }
    
    
    return (
        <Box sx={{ flexGrow: 1 , p: 5}}>
        <Box sx={{ flexGrow: 1, border: '2px solid lightgray', }}>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 3fr)' , p:2}}>
        <label htmlFor="text-area" id="select-label">Name: </label>
                        <Textarea
                            value={search}
                            onChange={handleTextareaChange}
                            placeholder="Search term..."
                         sx={{ mb: 1 }}
                        />
        </Box>
                
                    

         <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', p:2 }} >
                
                <label htmlFor="select-button" id="select-label">Priority: </label>
                <Select defaultValue="All" onChange={handlePriorityChange}>
                    <Option value="All">All</Option>
                    <Option value="High">High</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
                </Select>
        </Box>
                
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' , p:2}} >
             <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }} >
                <label htmlFor="select-button" id="select-label">State: </label>
                <Select defaultValue="All" onChange={handleStatusChange}>
                    <Option value="All">All</Option>
                    <Option value="Done">Done</Option>
                    <Option value="Undone">Undone</Option>
                </Select>
                <Box/>
                </Box>
             <Button onClick={handleClick}> Submit</Button>
         </Box>

    </Box>
    </Box>
     );

}



export default SearchForm;
