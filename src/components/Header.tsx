import { Link, NavLink } from "react-router-dom";
import { Layout, Badge, Button, Space } from "antd";
import { useTheme } from "../features/theme/ThemeContext";
import { useAppSelector } from "../app/hooks";

const { Header: AntHeader } = Layout;

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const borrowedCount = useAppSelector(
    (state) => state.books.borrowedIds.length,
  );

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "var(--bg-surface, #ffffff)",
        borderBottom: "1px solid #f0f0f0",
        height: 70,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <Space align="center" size="small">
          <span style={{ fontSize: 20, fontWeight: 800, color: "#1677ff" }}>
            Mini Library
          </span>
        </Space>
      </Link>

      <Space size="middle" align="center">
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            textDecoration: "none",
            fontWeight: isActive ? 700 : 500,
            color: isActive ? "#1677ff" : "inherit",
            padding: "6px 12px",
          })}
        >
          Tra cứu
        </NavLink>
        <NavLink
          to="/stats"
          style={({ isActive }) => ({
            textDecoration: "none",
            fontWeight: isActive ? 700 : 500,
            color: isActive ? "#1677ff" : "inherit",
            padding: "6px 12px",
          })}
        >
          Thống kê
        </NavLink>

        <Badge
          count={`${borrowedCount}/3`}
          style={{
            backgroundColor: borrowedCount >= 3 ? "#ff4d4f" : "#1677ff",
          }}
        />

        <Button onClick={toggleTheme}>
          {theme === "light" ? "Giao diện Tối" : "Giao diện Sáng"}
        </Button>
      </Space>
    </AntHeader>
  );
}
