// Design Tokens for ACE Opportunity Compass (Section 9 Specification)

export const TOKENS = {
  colors: {
    canvas: "#F5F6F8",
    ink: {
      default: "#14171F",
      muted: "#4A5268",
      subtle: "#7E88A0",
    },
    primary: {
      default: "#2B3F8C", // Deep indigo/cobalt
      hover: "#213271",
      subtle: "#EAEFFC",
    },
    status: {
      meets: "#1F7A4D", // Deep emerald
      meetsBg: "#E9F5EF",
      verify: "#A9690F", // Amber
      verifyBg: "#FDF4E7",
      unmet: "#A13A2E", // Muted rust
      unmetBg: "#FDF0EE",
    },
    border: {
      default: "#E2E4EA", // Hairline border
      subtle: "#ECEEF2",
    },
  },
  typography: {
    display: '"Fraunces", Georgia, serif',
    body: '"Public Sans", -apple-system, BlinkMacSystemFont, sans-serif',
  },
} as const;

export type StatusType = "meets" | "verify" | "unmet";

export const getStatusColors = (status: StatusType) => {
  switch (status) {
    case "meets":
      return {
        text: "text-status-meets",
        bg: "bg-status-meets-bg",
        border: "border-status-meets/30",
        label: "Confirmed",
      };
    case "verify":
      return {
        text: "text-status-verify",
        bg: "bg-status-verify-bg",
        border: "border-status-verify/30",
        label: "Verify with organizer",
      };
    case "unmet":
      return {
        text: "text-status-unmet",
        bg: "bg-status-unmet-bg",
        border: "border-status-unmet/30",
        label: "Unmet requirement",
      };
  }
};
