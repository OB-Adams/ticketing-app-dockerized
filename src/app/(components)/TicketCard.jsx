import Link from "next/link";
import DeleteBlock from "./DeleteBlock";
import PriorityDisplay from "./PriorityDisplay";
import ProgressBar from "./ProgressBar";
import StatusDisplay from "./StatusDisplay";

const TicketCard = ({ ticket }) => {
  const formatTimestamp = (timestamp) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
  };
  return (
    <div className="flex flex-col bg-gray-600 hover:bg-gray-500 rounded-md shadow-lg p-3 m-2">
      <div className="flex mb-3">
        <PriorityDisplay priority={ticket.priority} />
        <div className="ml-auto">
          <DeleteBlock id={ticket._id} />
        </div>
      </div>
      <Link href={`/TicketPage/${ticket._id}`} style={{ display: "contents" }}>
        <h4>{ticket.title}</h4>
        <hr className="hpx border-0 bg-gray-950  mg-2" />
        <p className="whitespace-pre-wrap">{ticket.description}</p>
        <div className="flex-grow">
          <div className="flex mt-2">
            <div className="flex flex-col">
              <p className="text-xs my-1">
                {formatTimestamp(ticket.createdAt)}
              </p>
              <ProgressBar progress={ticket.progress} />
            </div>
            <div className="ml-auto flex items-end">
              <StatusDisplay status={ticket.status} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TicketCard;
