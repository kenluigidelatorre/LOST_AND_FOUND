const ITEM = {
  pending: "Pending Review",
  approved: "Published",
  rejected: "Rejected",
  claimed: "Claimed",
  returned: "Returned",
};
const CLAIM = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  returned: "Completed",
};
export const StatusBadge = ({ status, claim }) => (
  <span className={`badge b-${status}`}>
    {(claim ? CLAIM : ITEM)[status] || status}
  </span>
);
export const TypeBadge = ({ type }) => (
  <span className={`badge t-${type}`}>
    {type === "lost" ? "Lost" : "Found"}
  </span>
);
