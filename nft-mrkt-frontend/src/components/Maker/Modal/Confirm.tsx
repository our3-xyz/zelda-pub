import React from "react";
import styles from "./Modal.module.scss";
import "./Confirm.scss"

const Confirm: React.FC <{ address:string, toggle: () => void }> = ({address, toggle}) => {
  return (
    <div className={`${styles.modal2} ${styles.darkBG} ${styles.centered}`}>
      <div className={`${styles.heading}`}>
        <div>Collection created at:</div>
        <div className="confirm-text" >{address}</div>
        <div className={`${styles.cancelBtn}`} onClick={() => toggle()}>OK</div>
      </div>
    </div>
  )
}

export default Confirm

