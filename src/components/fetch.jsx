import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import ReactPaginate from 'react-paginate';

function Fetch(page){
    const [url, setUrl] = useState(["https://restcountries.com/v3.1/all"]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState([]);
    const [currentPage, setCurrentPage] = useState([]);
    const [totalPage, setTotalPage] = useState([]);
    const [limit, setLimit] = useState([25]);
    const [sortType, setSortType] = useState([0]);

    // Fetch data from an api
    useEffect(()=>{
        fetch(url)
        .then((res) => res.json())
        .then((result) => {
            if(typeof result.status === typeof undefined){
                // Default sort by ASC
                setCountries(sortString(result, sortType));
            }
            result.length > 0 ? setCurrentPage(1) : setCurrentPage(0);
            setTotalPage(Math.ceil(result.length / limit));
        })
        .then(loading => {
            setLoading(false);
        })
        .catch(console.error)
    }, [url]);

    // Handle on pagination
    const handlePageChange = (e) => {
        setCurrentPage(e.selected + 1);
        document.getElementById("root").scrollIntoView();
    }

    // Sort by Official name
    const sortString = (data, type = 1) => {
        if(type === 0) return data;
        let sort = [...data];
        sort.sort((f, s) => type * f.name.official.localeCompare(s.name.official));
        return sort;
    }

    // Sort onchange on radio button value function
    const sortOnChange = (e) => {
        if(e.target.id === 'asc'){
            setCountries(sortString(countries));
            setSortType(1);
        }else if(e.target.id === 'desc'){
            setCountries(sortString(countries, -1));
            setSortType(-1);
        }
        setCurrentPage(1);
    }

    // Search function 
    const search = () => {
        let url = "https://restcountries.com/v3.1/name/";
        let val = document.getElementById('search-country').value;
        if(val.trim() !== ''){
            setUrl(url + val.trim());
        }else{
            setUrl('https://restcountries.com/v3.1/all');
        }
        setCurrentPage(1);
    }

    let i = 0;
    // Return value with jsx syntax
    return (
        <div className="container">
            <div>
                {loading ? <div id="loading-page">
                    <img width={100} height={100} id="loading-img" src={require('./../dist/images/loading.gif')} alt="" />
                </div> : null }
            </div>
            <div className="row px-4 pt-4 gap-3">
                <div className="col-12 col-md-4 form-group d-flex gap-2">
                    <input type="text" onChange={search} className="form-control" id="search-country"/>
                </div>
                <div className="col-12 col-md-4 d-flex gap-5">
                    <div className="d-flex just-content-center align-items-center gap-1">
                        <input type="radio" name="sort" onChange={sortOnChange} value="ASC" id="asc" /> <label htmlFor="asc">ASC</label>
                    </div>
                    <div className="d-flex just-content-center align-items-center gap-1">
                        <input type="radio" name="sort" onChange={sortOnChange} value="DESC" id="desc"/> <label htmlFor="desc">DESC</label>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                {
                    countries.slice((currentPage - 1)* limit, (currentPage * limit)).map(country =>
                        <div key={"country-" + i++} className="col-12 col-md-4 mb-3">
                            <div className="card h-100">
                                <img src={country.flags.png} className="card-img-top" height="200" style={ {
                                    objectFit: "contain"
                                } } alt={country.name.official}></img>
                                <div className="card-body">
                                    <p data-bs-target={"#modal-" + i} data-bs-toggle="modal" className="card-title fw-bold text-center">{country.name.official}</p>
                                    <div className="d-flex justify-content-center align-items-center mb-2 gap-4">
                                        <span>CCA2: {country.cca2}</span>
                                        <span>CCA3: {country.cca3}</span>
                                    </div>
                                    {/* <p className="text-center">{typeof country.name.nativeName !== typeof undefined ? country.name.nativeName.official : null}</p> */}
                                    <div className="d-flex gap-4">
                                        <div>altSpellings</div>
                                        <div>
                                        {
                                            country.altSpellings.map(alt => 
                                                <div>{alt}</div>
                                            )
                                        }
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <span style={{width:60}}>Root</span>
                                        <span>{country.idd.root}</span>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <div style={{width:60}}>Suffixes</div>
                                        <div className="d-flex gap-2 flex-wrap">{typeof country.idd.suffixes !== typeof undefined ? country.idd.suffixes.map(suffixe => 
                                                <div> {suffixe} </div>
                                            ) : null}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal fade" id={"modal-" + i}>
                                <div className="modal-dialog" style={{maxWidth: 1000}}>
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">{country.name.official}</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div><span className="fw-bold">Capital City:</span> {country.capital}</div>
                                            <div className="d-flex gap-3">
                                                <div className="fw-bold">Currencies: </div>
                                                <table>
                                                    <tbody>
                                                        {
                                                            Object.keys(country.currencies).map((key) => 
                                                                
                                                                    <tr key={country.currencies[key].name}>
                                                                        <td>Name: {country.currencies[key].name}</td>
                                                                        <td style={{paddingLeft:20}}>Symbol: {country.currencies[key]?.symbol}</td>
                                                                    </tr>
                                                                
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div><span className="fw-bold">Region:</span> {country.region}</div>
                                            <div><span className="fw-bold">Sub Region:</span> {country.subregion}</div>
                                            <div><span className="fw-bold">Country Area:</span> {country.area} Km<sup>2</sup> </div>
                                            <div><span className="fw-bold">Google Map:</span> <a target={'_blank'} rel="noopener noreferrer" href={country.maps?.googleMaps ?? '#'}>{country.maps?.googleMaps ?? ''}</a> </div>
                                            <div><span className="fw-bold">Population:</span> {country.population}</div>
                                            <div><span className="fw-bold">Driving len:</span> {country.car?.side}</div>
                                            <div><span className="fw-bold">Time zone:</span> {country.timezones.join(' / ')}</div>
                                            <div><span className="fw-bold">Driving len:</span> {country.continents}</div>
                                            <div><span className="fw-bold">Start of the week:</span> {country.startOfWeek}</div>
                                            <div className="d-flex align-items-center" style={{ paddingRight:100 }}><span className="fw-bold mt-4">Coat of Arms</span> <img className="mx-auto" width={250} height={250} src={country.coatOfArms.png} alt="coat of arms" /></div>

                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={totalPage}
                forcePage={currentPage - 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
            />
        </div>
    );
}

export default Fetch;