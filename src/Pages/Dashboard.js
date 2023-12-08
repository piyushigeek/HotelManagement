import React, { useState, useRef } from 'react'
import axios from 'axios';
import CurrencyInput from './CurrencyInput'

import Plus from '../assets/images/plus.svg'
import Add from '../assets/images/add.svg'
import Minus from '../assets/images/minus.svg'
import Restaurant from '../assets/images/restaurant.png'
import FamilyDinner from '../assets/images/family_dinner.svg'
import Table3 from '../assets/images/table3.svg'
import Table4 from '../assets/images/table4.svg'

import { useDispatch } from 'react-redux';
import { setOrderList, updatedOrderList } from './Redux/authSlice/authSlice'
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [chips, setChips] = useState(['Debit Card', 'Credit Card', 'Google Pay', 'Crypto Currency', 'UPI']);


  const MenuList = [
    { id: 1, item_name: "Butter Chicken", price: 1300 },
    { id: 2, item_name: "Paneer Tikka", price: 1399 },
    { id: 3, item_name: "Dal Makhani", price: 1199 },
    { id: 4, item_name: "Rajma Chawal", price: 1099 },
    { id: 5, item_name: "Punjabi Lassi", price: 499 },
    { id: 6, item_name: "Papad", price: 299 },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IsReservedModal, setIsReservedModal] = useState(false);
  const [Name, setName] = useState('');
  const [Mobile, setMobile] = useState(null);
  const [SelectedTable, setSelectedTable] = useState(null);
  const [PaymentMode, setPaymentMode] = useState(null);
  const [SelectedPaymentMode, setSelectedPaymentMode] = useState('')
  const [TipAmount, setTipAmount] = useState(0);
  const OrderList = useSelector((state) => state.auth.OrderList);

  const [ReservedTableDetails, setReservedTableDetails] = useState(null);

  const [SelectedMenu, setSelectedMenu] = useState({
    name: '',
    phone: '',
    selectedTableId: null,
    selected_items: []
  });

  const openModal = (index) => {
    if (isReservedTable(index)) {
      setIsReservedModal(true);
      setTipAmount(0);
      setPaymentMode(null);
      const itemIndex = OrderList.findIndex((selected) => selected.selectedTableId === index);
      const tmp = Array.from(OrderList);
      if (tmp.length > 0 && tmp[itemIndex] !== undefined && tmp[itemIndex] !== null) {
        setReservedTableDetails(tmp[itemIndex]);
      }
    } else {
      setIsModalOpen(true);
      setSelectedTable(index);
      setSelectedMenu((prevMenu) => ({
        ...prevMenu,
        selectedTableId: index
      }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
    setSelectedMenu({
      name: '',
      phone: '',
      selectedTableId: null,
      selected_items: []
    });
  };

  const onChangeName = (value) => {
    setSelectedMenu((prevMenu) => ({
      ...prevMenu,
      name: value,
    }));
  }

  const OnChangePhone = (value) => {
    setSelectedMenu((prevMenu) => ({
      ...prevMenu,
      phone: value,
    }));
  }

  const selectMenu = (item) => {
    const itemIndex = SelectedMenu.selected_items.findIndex((selected) => selected.id === item.id);
    const tmp = Array.from(SelectedMenu.selected_items);
    if (tmp.length === 0 || itemIndex === -1) {
      tmp.push({ ...item, qty: 1, totalPrice: item.price });
    } else {
      tmp[itemIndex]['qty'] += 1
      tmp[itemIndex]['totalPrice'] = tmp[itemIndex]['qty'] * tmp[itemIndex]['price'];
    }

    setSelectedMenu((prev) => {
      return {
        ...prev,
        selected_items: tmp
      }
    });
  }

  const minusItem = (item) => {
    const itemIndex = SelectedMenu.selected_items.findIndex((selected) => selected.id === item.id);
    const tmp = Array.from(SelectedMenu.selected_items)
    if (tmp[itemIndex]['qty'] !== 1) {
      tmp[itemIndex]['qty'] -= 1
      tmp[itemIndex]['totalPrice'] = tmp[itemIndex]['qty'] * tmp[itemIndex]['price'];
    } else {
      tmp.splice(itemIndex, 1);
    }
    setSelectedMenu((prev) => {
      return {
        ...prev,
        selected_items: tmp
      }
    })
  };

  const plusItem = (item) => {
    const itemIndex = SelectedMenu.selected_items.findIndex((selected) => selected.id === item.id);
    const tmp = Array.from(SelectedMenu.selected_items)
    tmp[itemIndex]['qty'] += 1
    tmp[itemIndex]['totalPrice'] = tmp[itemIndex]['qty'] * tmp[itemIndex]['price'];

    setSelectedMenu((prev) => {
      return {
        ...prev,
        selected_items: tmp
      }
    })
  };

  const gettotal = (action) => {
    const updatedItems = action === 'review' ? [...ReservedTableDetails.selected_items] : [...SelectedMenu.selected_items];
    if (updatedItems.length > 0) {
      if (action === 'amount') {
        const overallTotalPrice = updatedItems.reduce((total, selectedItem) => {
          return total + selectedItem.totalPrice;
        }, 0);
        return overallTotalPrice;
      } else {
        const overallTotalQTY = updatedItems.reduce((total, selectedItem) => {
          return total + selectedItem.qty;
        }, 0);
        return overallTotalQTY;
      }
    } else {
      return 0;
    }
  }

  const GetReservedTotal = () => {
    const updatedItems = [...ReservedTableDetails.selected_items];
    if (updatedItems.length > 0) {
      const overallTotalPrice = updatedItems.reduce((total, selectedItem) => {
        return total + selectedItem.totalPrice;
      }, 0);
      return overallTotalPrice;
    } else {
      return 0;
    }
  }

  const confirm = () => {
    dispatch(setOrderList(SelectedMenu));
    closeModal();
  };

  const isReservedTable = (tableId) => {
    if (OrderList.length > 0) {
      const findIndex = OrderList.findIndex((item) => item.selectedTableId === tableId);
      if (findIndex !== -1) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  const onCloseReservedModal = () => {
    setIsReservedModal(false);
    setTipAmount(0);
    setPaymentMode(null);
    setReservedTableDetails(null);
  }

  const OnCompleteOrder = () => {
    setIsReservedModal(false);
    setTipAmount(0);
    setPaymentMode(null);

    const itemIndex = OrderList.findIndex((selected) => selected.selectedTableId === ReservedTableDetails.selectedTableId);
    const tmp = Array.from(OrderList);
    if (tmp.length > 0 && tmp[itemIndex] !== undefined && tmp[itemIndex] !== null) {
      tmp.splice(itemIndex, 1);
      dispatch(updatedOrderList(tmp));
    }
  }

  return (
    <>
      <div className=' h-screen w-full flex justify-center items-center bg-[#F5F5F5] select-none'>
        <div className="grid grid-rows-2 grid-flow-col gap-[2px] w-full h-full">
          <div
            className={`w-full h-full rounded ${isReservedTable(1) ? 'bg-orange-300' : 'bg-green-400'}  flex justify-center items-center text-[90px] text-white cursor-pointer`}
            style={{
              backgroundImage: `url(${Restaurant})`,
              backgroundSize: '60% 60%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
            onClick={() => openModal(1)}></div>
          <div className={`w-full h-full rounded ${isReservedTable(2) ? 'bg-orange-300' : 'bg-green-400'} flex justify-center items-center text-[90px] text-white cursor-pointer`}
            style={{
              backgroundImage: `url(${FamilyDinner})`,
              backgroundSize: '90% 90%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
            onClick={() => openModal(2)}></div>
          <div className={`w-full h-full rounded ${isReservedTable(3) ? 'bg-orange-300' : 'bg-green-400'} flex justify-center items-center text-[90px] text-white cursor-pointer`}
            style={{
              backgroundImage: `url(${Table3})`,
              backgroundSize: '90% 90%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
            onClick={() => openModal(3)}></div>
          <div className={`w-auto h-auto rounded ${isReservedTable(4) ? 'bg-orange-300' : 'bg-green-400'} flex justify-center items-center text-[90px] text-white cursor-pointer`}
            style={{
              backgroundImage: `url(${Table4})`,
              backgroundSize: '90% 90%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
            onClick={() => openModal(4)}></div>
        </div>
      </div>
      {isModalOpen && <>
        <div className="modal select-none">
          <div className="modal-content">
            <div className="grid grid-cols-2 gap-4">
              <div >
                <div className=''>
                  <div className='flex flex-col mb-3'>
                    <span className='py-1'>Name : </span>
                    <input name='name' type='text' className='border rounded  h-[45px] px-2' onChange={(e) => onChangeName(e.target.value)} />
                  </div>

                  <div className='flex flex-col mb-3'>
                    <span className='py-1'>Phone  : </span>
                    <input name='name' type='number' className='border rounded  h-[45px] px-2' onChange={(e) => OnChangePhone(e.target.value)} />
                  </div>
                </div>
                <div>
                  <div className='w-full flex justify-center p-3 font-[500] text-[15px]]'>The Menu</div>
                  <div className='flex justify-between items-center p-1 px-3 bg-slate-300 mb-1 rounded'>
                    <div className='uppercase'>Name</div>
                    <div className='flex gap-20 items-center uppercase'>
                      price
                      <img src={Plus} width={30} className='cursor-pointer collapse bg-slate-300 ' />
                    </div>
                  </div>
                  {MenuList.map((items, index) => (
                    <>
                      <div key={index} className='flex justify-between items-center p-1 px-3 text-[14px] bg-[#e5e5ea]  mb-1 rounded'>
                        <div>{items.item_name}</div>
                        <div className='flex gap-20  items-center'>
                          {items.price}
                          <img src={Plus} width={30} className='cursor-pointer' onClick={() => { selectMenu(items) }} />
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div className='border rounded flex flex-col justify-between'>
                <div>
                  <div className='grid grid-cols-2 gap-4 p-3 border-b'>
                    <div> Name : {SelectedMenu.name}</div>
                    <div> Phone : {SelectedMenu.phone}</div>
                  </div>
                  <div className='px-3 pt-2'>Selected Items </div>
                  {SelectedMenu?.selected_items.map((items, index) => (
                    <>
                      <div key={index} className='flex justify-between items-center p-1 px-3 text-[14px] bg-[#e5e5ea] mx-3 mb-1 rounded'>
                        <div>{items.item_name}</div>
                        <div className='flex items-center'>
                          <div className='flex items-center'> <img src={Minus} width={23} className='cursor-pointer' onClick={() => { minusItem(items) }} />
                            <div className='w-[80px] text-center'>{items.qty}</div>
                            <img src={Add} width={23} className='cursor-pointer' onClick={() => { plusItem(items) }} /></div>
                          <div className='w-[100px] text-right'>{items.totalPrice}</div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
                <div >
                  {gettotal('amount') > 0 && (<>
                    <div className='flex justify-between items-center p-2 border-b mx-2 mb-5'>
                      <div>Total</div>
                      <div className='flex gap-7 items-center'>
                        <div className='pr-[50px]'>{gettotal()}</div>
                        <div>{gettotal('amount')}</div>
                      </div>
                    </div>
                  </>)}
                  <div className='mb-4 px-3 flex justify-end gap-3'>
                    <button className='p-2 border rounded w-[20%]  text-black font-[500] text-[14px]' onClick={() => { closeModal() }}>Cancel</button>
                    {gettotal('amount') > 0 && <button onClick={() => { confirm(); }} className='p-2 border rounded w-[20%] bg-green-200 text-black font-[500] text-[14px]'>Confirm</button>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      }

      {IsReservedModal && <>
        <div className="modal select-none">
          <div className="modal-content !w-[750px]">
            <div className='flex items-center justify-center font-[600] text-[25px] uppercase pb-3'>
              <h1>Order Details</h1>
            </div>
            <div className='border rounded'>
              <div className='grid grid-cols-2 gap-4 p-3 '>
                <div> Name : <span className='font-[600] italic underline'>{ReservedTableDetails?.name}</span> </div>
                <div> Phone : <span className='font-[600] italic underline'>{ReservedTableDetails?.phone}</span></div>
              </div>
              <div className='grid grid-cols-3 gap-4 p-3'>
                {ReservedTableDetails.selected_items && ReservedTableDetails.selected_items.map((item, index) => (
                  <>
                    <div key={index} className='border rounded-xl p-1 flex justify-between'>
                      <div className='flex flex-col justify-between'>
                        <div className='font-[400] text-[16px] px-2 py-1'>{item.item_name}</div>
                        <div className='font-[400] text-[18px] px-2 py-1'>${item.totalPrice}</div>
                      </div>
                      <div className='font-[500] text-[30px] w-10 flex justify-center items-center '>{item.qty}</div>
                    </div>
                  </>
                ))}

              </div>
              <hr className='m-3'></hr>
              <div className='grid grid-cols-2 gap-4 p-3'>
                <div className="border-r">
                  <div className='grid grid-cols-2 gap-4 pr-7'>
                    <div
                      className={`flex ${PaymentMode === 'Cash' ? 'bg-gray-400 text-[#FFFFFF]' : ''
                        } justify-center border rounded p-1 text-[14px] cursor-pointer`}
                      onClick={() => {
                        setTipAmount(0);
                        setPaymentMode('Cash');
                      }}
                    >
                      Cash
                    </div>
                    <div
                      className={`flex ${PaymentMode === 'Online' ? 'bg-gray-400 text-[#FFFFFF]' : ''
                        } justify-center border rounded p-1 text-[14px] cursor-pointer`}
                      onClick={() => {
                        setTipAmount(0);
                        setPaymentMode('Online');
                      }}
                    >
                      Online
                    </div>
                  </div>
                  {PaymentMode === 'Cash' && (
                    <div className='mt-3 pr-7'>
                      <input
                        className='p-2 border rounded text-[14px] w-full'
                        type='text'
                        onChange={(e) => { setTipAmount(e.target.value) }}
                        placeholder='Amount'
                      />
                    </div>
                  )}
                  {PaymentMode === 'Online' && (
                    <div className='pr-7 mt-3 gap-2' style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {chips.map((chip, index) => (
                        <span
                          key={index}
                          className={`border ${SelectedPaymentMode === chip ? 'bg-gray-400' : ''
                            } cursor-pointer  mr-1 rounded-[30px] w-max p-[2px] px-2 text-[14px]`}
                          onClick={() => {
                            setSelectedPaymentMode(chip);
                          }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className='relative bottom-0 mb-0'>
                  <div className='flex justify-between'>
                    <div>Total qty</div>
                    <div>{gettotal('review')}</div>
                  </div>
                  <hr></hr>
                  <div className='flex justify-between mt-3'>
                    <div>Total Amount</div>
                    <div>{GetReservedTotal()}</div>
                  </div>
                  {PaymentMode === 'Cash' && <>
                    <div className='flex justify-between'>
                      <div>Tip</div>
                      <div>{TipAmount}</div>
                    </div>
                    <hr></hr>
                    <div className='flex justify-between'>
                      <div>Total Payable Amount</div>
                      <div>{(Number(TipAmount) + Number(GetReservedTotal()))}</div>
                    </div>

                  </>}
                </div>
              </div>

            </div>

            <div className='flex justify-end gap-2 mt-2'>
              <button className='p-2 border rounded w-[20%] text-black font-[500] text-[14px]' onClick={() => onCloseReservedModal()}>Close</button>
              <button className='p-2 border rounded w-[20%] bg-green-200 text-black font-[500] text-[14px]' onClick={() => OnCompleteOrder()}>Submit</button>
            </div>
          </div>
        </div>
      </>}

    </>)
}

export default Dashboard