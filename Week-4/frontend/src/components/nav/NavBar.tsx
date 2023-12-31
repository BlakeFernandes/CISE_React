import React from "react";
import styles from "@/components/nav/nav.module.scss";
type Props = {
    children: React.ReactNode;
};
const NavBar = ({ children }: Props) => {
    return <nav className={styles.navbar}>{children}</nav>;
};
export default NavBar;