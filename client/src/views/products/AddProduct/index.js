import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CForm,
    CFormGroup,
    CFormText,
    CTextarea,
    CInput,
    CInputFile,
    CInputCheckbox,
    CLabel,
    CSelect,
    CRow,
    CSwitch
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { addProduct } from '../../../actions/ProductActions'
import { useSelector } from 'react-redux';
import moment from "moment";
import SweetAlert from 'react-bootstrap-sweetalert';
import { getAllCatagories } from 'src/actions/CatagoryActions'
import { SERVER_API } from 'src/actions/actionTypes'
import axios from "axios"
import {motion} from "framer-motion";

function AddProduct() {
    const [ProductName, setProductName] = React.useState("")
    const [ProductPrice, setProductPrice] = React.useState("")
    const [ProductDescription, setProductDescription] = React.useState("")
    const [ExpiryDate, setExpiryDate] = React.useState("")
    const [CatagoryID, setCatagoryID] = React.useState("0")
    const [SubCatID, setSubCatID] = React.useState("0")
    const [BuyPrice, setBuyPrice] = React.useState("")
    const [SubCats, setSubCats] = React.useState([])
    const [InStock, setInStock] = React.useState(false)
    const [ShowError, setShowError] = React.useState(false)
    const [ShowSuccess, setShowSuccess] = React.useState(false)
    const [ShowFail, setShowFail] = React.useState(false)

    const handleDateChange = (date) => {
        const dateObj = new Date(date)
        var momentObj = moment(dateObj);
        setExpiryDate(momentObj.format("YYYY-MM-DD"));
    };

    useEffect(() => {
        const getSubCats = axios.get(`${SERVER_API}/api/getsubcats?id=${CatagoryID}`,
            {
                headers: { "Content-Type": "application/json" },
            }
        )
            .then((response) => {
                if (response.data.success === true) {
                    setSubCats(response.data.List)
                }
            })
            .catch((err) => {
                console.log(err)
            })

        return getSubCats;

    }, [CatagoryID])

    const dispatch = useDispatch()

    useEffect(() => {
        getCatagories()
    }, [])

    const getCatagories = async () => {
        await dispatch(getAllCatagories())
    }

    const userEmail = useSelector(state => state.user?.email)
    const catagories = useSelector(state => state.catagories)

    const submitHandler = () => {
        const dateObj = new Date()
        const momentObj = moment(dateObj)
        const register_date = momentObj.format("YYYY-MM-DD")
        dispatch(addProduct(ProductName, parseInt(CatagoryID), parseInt(SubCatID), ExpiryDate, parseInt(ProductPrice), parseInt(BuyPrice), 0, 0, 0, register_date, setShowSuccess, setShowFail))
    }

    const resetFunc = () => {
        setProductName("")
        setProductPrice("")
        setProductDescription("")
        setExpiryDate("")
        setCatagoryID("")
    }


    return (
        <>
            <CRow>
                <SweetAlert
                    success
                    title={"Success"}
                    show={ShowSuccess}
                    onConfirm={() => setShowSuccess(false)}
                >
                    Product Added
                </SweetAlert>
                <SweetAlert
                    danger
                    title={"Failed"}
                    show={ShowFail}
                    onConfirm={() => setShowFail(false)}
                >
                    Unable to Add Product
                </SweetAlert>
                <SweetAlert
                    warning
                    title={"Network Error"}
                    show={ShowError}
                    onConfirm={() => setShowError(false)}
                >
                    Request Failed
                </SweetAlert>
                <CCol xs="12" md="12">
                    <CCard>
                        <CCardHeader>
                            Add Product
                            <small> Inventory</small>
                        </CCardHeader>
                        <CCardBody>
                            <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel>Email</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <p className="form-control-static">{userEmail && userEmail}</p>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="text-input">Product Name</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CInput value={ProductName} onChange={(e) => setProductName(e.target.value)} id="text-input" name="text-input" placeholder="Text" />
                                        <CFormText>Product Display Name</CFormText>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="date-input">Expire Date (Optional)</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CInput value={ExpiryDate} onChange={e => handleDateChange(e.target.value)} type="date" id="date-input" name="date-input" placeholder="date" />
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="textarea-input">Product Description</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CTextarea
                                            value={ProductDescription}
                                            onChange={e => setProductDescription(e.target.value)}
                                            name="textarea-input"
                                            id="textarea-input"
                                            rows="9"
                                            placeholder="Content..."
                                        />
                                    </CCol>
                                </CFormGroup>
                                <motion.div layout>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="select">Product Catagory</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CSelect value={CatagoryID} onChange={e => { setCatagoryID(e.target.value) }} custom name="select" id="select">
                                            <option value="0">Please select</option>
                                            {catagories && catagories?.map((item) => (
                                                <option key={item.categories_id} value={item.categories_id.toString()}>{item.categories_name}</option>
                                            ))}
                                        </CSelect>
                                    </CCol>
                                </CFormGroup>
                                {SubCats.length > 0 && <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="textarea-input">Select Sub Catagory</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CSelect value={SubCatID} onChange={e => { setSubCatID(e.target.value) }} custom name="select" id="select">
                                            <option value="0">Please select</option>
                                            {SubCats && SubCats?.map((item) => (
                                                <option key={item.subcat_id} value={item?.subcat_id?.toString()}>{item.subcat_name}</option>
                                            ))}
                                        </CSelect>
                                    </CCol>
                                </CFormGroup>}
                                </motion.div>
                                <CFormGroup row>
                                    <CCol tag="label" sm="3" className="col-form-label">
                                        In Stock
                                    </CCol>
                                    <CCol sm="9">
                                        <CSwitch
                                            checked={InStock}
                                            onClick={() => setInStock(!InStock)}
                                            className="mr-1"
                                            color="primary"
                                            defaultChecked
                                            shape="pill"
                                        />
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel>Attributes</CLabel>
                                    </CCol>
                                    <CCol md="9">
                                        <CFormGroup variant="custom-checkbox" inline>
                                            <CInputCheckbox
                                                custom
                                                id="inline-checkbox1"
                                                name="inline-checkbox1"
                                                value="option1"
                                            />
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">Wearables</CLabel>
                                        </CFormGroup>
                                        <CFormGroup variant="custom-checkbox" inline>
                                            <CInputCheckbox custom id="inline-checkbox2" name="inline-checkbox2" value="option2" />
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox2">Beauty</CLabel>
                                        </CFormGroup>
                                        <CFormGroup variant="custom-checkbox" inline>
                                            <CInputCheckbox custom id="inline-checkbox3" name="inline-checkbox3" value="option3" />
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">Edible</CLabel>
                                        </CFormGroup>
                                        <CFormGroup variant="custom-checkbox" inline>
                                            <CInputCheckbox custom id="inline-checkbox3" name="inline-checkbox3" value="option3" />
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">Not for children</CLabel>
                                        </CFormGroup>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="text-input">Product Price</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CInput value={ProductPrice} onChange={e => setProductPrice(e.target.value)} id="text-input" type="number" name="text-input" placeholder="Amount in numbers" />
                                        <CFormText>Enter amount less than 100000</CFormText>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="text-input">Product Bought On Price</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CInput value={BuyPrice} onChange={e => setBuyPrice(e.target.value)} id="text-input" type="number" name="text-input" placeholder="Amount in numbers" />
                                        <CFormText>Enter amount less than 100000</CFormText>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CLabel col md={3}>Product Image (Optional)</CLabel>
                                    <CCol xs="12" md="9">
                                        <CInputFile custom id="custom-file-input" />
                                        <CLabel htmlFor="custom-file-input" variant="custom-file">
                                            Choose file...
                                        </CLabel>
                                    </CCol>
                                </CFormGroup>
                            </CForm>
                        </CCardBody>
                        <CCardFooter>
                            <CButton disabled={ProductName < 4 || CatagoryID === "0" || BuyPrice === "" || ProductPrice === ""} type="submit" size="sm" color="primary" onClick={submitHandler}><CIcon name="cil-scrubber" /> Submit</CButton>
                            <CButton type="reset" size="sm" color="danger" onClick={() => resetFunc()}><CIcon name="cil-ban" /> Reset</CButton>
                        </CCardFooter>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default AddProduct
