import React, { useEffect, useState } from 'react';
import { Row, Col, Popconfirm, Modal, Form, Input, Table, DatePicker, message, Upload, Button, Icon, Select, Pagination, Spin, Radio } from 'antd';
import BridgeModel from "../../../../Common/BasicModal/BridgeModel";

export default function ExpenseDetail() {
    return (
        <div className='expense-detail-box'>
            <div className='expense-title'>
                费用明细
            </div>
            <Button className='expense-add-btn'>新增</Button>
            <div className='expense-content'>
                <div className='receipt-box'>
                    <div className='receipt-title'>发票：</div>
                    <div className='receipt-list'>
                        <div className='receipt-item'><i className='iconfont icon-cash receipt-icon' />十九八七六123.pdf</div>
                        <div className='receipt-item'><i className='iconfont icon-cash receipt-icon' />十九八七六123.pdf</div>
                        <div className='receipt-item'><i className='iconfont icon-cash receipt-icon' />十九八七六123.pdf</div>
                        <div className='receipt-item'><i className='iconfont icon-cash receipt-icon' />十九八七六五四三二一123.pdf</div>
                        <div className='receipt-item'><i className='iconfont icon-cash receipt-icon' />十九八七六五四三二一123.pdf</div>
                        <div className='receipt-item'><i className='iconfont icon-cash receipt-icon' />十九八七六五四三二一123.pdf</div>
                        <div className='receipt-item'><i className='iconfont icon-cash receipt-icon' />十九八七六五四三二一123.pdf</div>
                        <div className='receipt-item'><i className='iconfont icon-cash receipt-icon' />十九八七六五四三二一123.pdf</div>
                    </div>
                </div>
                <div className='receipt-box'>
                    <div className='receipt-title'>附件：</div>
                    <div className='receipt-list'>
                        <div className='receipt-item'><i className='iconfont icon-file receipt-icon' />十九八七六123.pdf</div>
                        <div className='receipt-item'><i className='iconfont icon-file receipt-icon' />十九八七六123.pdf</div>
                        <div className='receipt-item'><i className='iconfont icon-file receipt-icon' />十九八七六五四三二一123.pdf</div>
                    </div>
                </div>
            </div>
            <div className='attachment-box'>
                <div className='attachment-item'>
                    附件：
                    <div className='file-item'><i className='iconfont icon-file attachment-icon' />十九八七六123455555555555555555555555555555.pdf</div>
                </div>
                <div className='attachment-item'>
                    附件：
                    <div className='file-item'><i className='iconfont icon-file attachment-icon' />十九八七六123.pdf</div>
                </div>
            </div>
        </div>
    )
}
