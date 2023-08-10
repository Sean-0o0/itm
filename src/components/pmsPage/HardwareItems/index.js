import React, {useEffect, useState} from 'react';
import EnterBidInfoModel from '../../../components/pmsPage/HardwareItems/EnterBidInfoModel';
import PollResultModel from "./PollResultModel";
import PollResultEnterModel from "./PollResultEnterModel";
import RequireModel from "./RequireModel";
import AgreementEnterModal from "./AgreementEnterModel";
import BidSectionModel from "./BidSectionModel";
import DemandInitiated from "./DemandInitiated";
import SendMailModal from "../SendMailModal";
import EditMemberInfoModel from "../MemberDetailPage/EditMemberInfoModel";
import EditBidInfoModel from "./EditBidInfoModel";

//首页
export default function HardwareItems(props) {
  // const {} = props;
  const [bidVisible, setBidVisible] = useState(false);
  const [pollResultVisible, setPollResultVisible] = useState(false);
  const [pollResultEnterVisible, setPollResultEnterVisible] = useState(false);
  const [requireVisible, setRequireVisible] = useState(false);
  const [agreementEnterVisible, setAgreementEnterVisible] = useState(false);
  useEffect(() => {
    return () => {
    };
  }, []);

  const closeBidInfoModal = () => {
    setBidVisible(false);
  }

  const closePollResultModal = () => {
    setPollResultVisible(false);
  }

  const closePollResultEnterModal = () => {
    setPollResultEnterVisible(false);
  }

  const closeRequireVisibleModal = () => {
    setRequireVisible(false);
  }

  const closeAgreementEnterModal = () => {
    setAgreementEnterVisible(false);
  }

  return (<div>
      {bidVisible && (
        <EnterBidInfoModel closeModal={closeBidInfoModal} visible={bidVisible}/>
      )
      }
      {pollResultVisible && (
        <EditBidInfoModel closeModal={closePollResultModal} visible={pollResultVisible}/>
      )
      }
      {pollResultEnterVisible && (
        <EditMemberInfoModel closeModal={closePollResultEnterModal} visible={pollResultEnterVisible}/>
      )
      }
      {requireVisible && (
        <SendMailModal closeModal={closeRequireVisibleModal} visible={requireVisible}/>
      )
      }
      {agreementEnterVisible && (
        <DemandInitiated xmmc={"传进来的项目名称"} xmid={10}
                         closeModal={closeAgreementEnterModal}
                         visible={agreementEnterVisible}/>
      )
      }
      <button onClick={() => setBidVisible(true)}>中标信息录入</button>
      <button onClick={() => setPollResultVisible(true)}>询比结果列表</button>
      <button onClick={() => setPollResultEnterVisible(true)}>询比结果录入</button>
      <button onClick={() => setRequireVisible(true)}>需求列表</button>
      <button onClick={() => setAgreementEnterVisible(true)}>合同信息录入-普通人员</button>
    </div>
  );
}
