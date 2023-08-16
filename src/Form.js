
import { useState } from 'react';
import { useContext } from 'react';
import { ToDoContext } from './ToDoList';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { Textarea } from '@mui/joy';
import {Button} from '@mui/material'
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
        
        <Grid p={5}>
        <Grid p={5} border={"2px solid lightgray"}>
            <Grid container spacing={2}>
            <Grid item xs={1} textAlign={"center"}>
                <label htmlFor="text-area" id="select-label">Name: </label>
            </Grid>
            <Grid item xs={10} textAlign={"center"}>
                        <Textarea
                            value={search}
                            onChange={handleTextareaChange}
                            placeholder="Search term..."
                         sx={{ mb: 1 }}
                        />
            </Grid>
            <Grid item xs={1}/>
            </Grid>
            

            

                
                    

            <Grid container spacing={2}>
                <Grid item xs={1} textAlign={"center"}>
                    <label htmlFor="select-button" id="select-label">Priority: </label>
                </Grid>

                <Grid item xs={4} textAlign={"center"}>
                    <Select defaultValue="All" onChange={handlePriorityChange}>
                        <Option value="All">All</Option>
                        <Option value="High">High</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="Low">Low</Option>
                    </Select>
                </Grid>
                <Grid item xs={7}/>
            </Grid>

                
            <Grid container spacing={2}>
                <Grid item xs={1} textAlign={"center"}>
                    <label htmlFor="select-button" id="select-label">State: </label>
                </Grid>


                <Grid item xs={4} textAlign={"center"}>
                <Select defaultValue="All" onChange={handleStatusChange}>
                    <Option value="All">All</Option>
                    <Option value="Done">Done</Option>
                    <Option value="Undone">Undone</Option>
                </Select>
                </Grid>

            
                <Grid item xs={5}/>
                <Grid item xs={1} alignContent={"right"}>
                    <Button onClick={handleClick} variant="contained"> Search</Button>
                </Grid>

                <Grid item xs={1}/>
             </Grid>
         </Grid>

        </Grid>

     );

}



export default SearchForm;
