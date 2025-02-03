import fetchGlobal from "@/lib/fetch-data";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const ModelListSelect = ({ id, setIsDisabled, setFormUpdate }) => {
  const [models, setModels] = useState();
  const [selected, setSelected] = useState([]);
  const [modelNames, setModelNames] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClick = (model) => {
    if (selected.includes(model.id)) {
      setSelected(selected.filter((el) => el !== model.id));
    } else {
      setSelected((prev) => [...prev, model.id]);
    }
  };

  useEffect(() => {
    fetchGlobal("/v1/model/admin/list/lite").then((res) => {
      setModels(res);
    });
  }, [id]);

  useEffect(() => {
    if (selected.length) {
      const temp = selected.map((item) => {
        const model = models.find((el) => el.id === item);
        return model.name;
      });

      setModelNames(temp.join(", "));
      setIsDisabled(false);
      setFormUpdate({
        connected_model: JSON.stringify(selected),
        desired_model: temp.join(", "),
      });
    } else {
      setIsDisabled(true);
      setModelNames("");
      setFormUpdate({});
    }
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <p className="text-gray-600 w-full mb-2">
        Select the related model to{" "}
        <span className="text-blue-500">process</span> the book, select one or
        more that represent the customer's desired model.
      </p>
      <div className="w-full relative" ref={dropdownRef}>
        <div
          className="border-[1px] rounded-md py-2 px-3 h-10 flex items-center cursor-pointer justify-between"
          onClick={() => setOpen(!open)}
        >
          <p
            className={`text-[16px] ${
              modelNames ? "text-black" : "text-gray-600"
            } truncate overflow-hidden whitespace-nowrap w-full max-w-[410px]`}
          >
            {!models ? "loading..." : modelNames || "Select one or more model"}
          </p>
          <ChevronDown
            size={18}
            className={`transform transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {open && (
          <div className="absolute w-full flex-1 z-50">
            <div
              className="w-full rounded-md border bg-white mt-2 p-1 overflow-y-scroll z-50"
              style={{ maxHeight: "250px" }}
            >
              {models &&
                models.map((model, index) => (
                  <div
                    key={index + "model"}
                    className="rounded-xl flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleClick(model)}
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        alt={model.name}
                        src={model.cover_img}
                        className="h-8 w-8 rounded-full"
                      />
                      <p
                        className={`${
                          selected.includes(model.id)
                            ? "text-black font-bold"
                            : "text-gray-600 font-thin"
                        } text-[16px]`}
                      >
                        {model.name}
                      </p>
                    </div>
                    {selected.includes(model.id) && (
                      <Check size={18} color="green" />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ModelListSelect;
