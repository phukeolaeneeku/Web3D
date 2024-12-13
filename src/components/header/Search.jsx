import { useState, useEffect, useRef  } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Banner from "../header/Banner";
import Menu from "../menuFooter/Menu";
import Header from "../header/Header";
import { GrStatusGoodSmall } from "react-icons/gr";

const Search = () => {
  const [logo, set_logo] = useState(null);
  const navigate = useNavigate();
  const [goods_list, set_goods_list] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");
  const [search, setSearch] = useState(searchParam || "");
  const [filter, set_filter] = useState(1);
  const [category_list, set_category_list] = useState([]);
  const [category_name, set_category_name] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imags, setImags] = useState([]);
  const imageRef = useRef(null);
  const image_id = imags[currentImageIndex]?.id;
  const storage = JSON.parse(window.localStorage.getItem("user"));

  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  useEffect(() => {
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/categories",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_category_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_logo(response.data[0].logo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [logo]);

  const handleCategoryClick = (categoryName) => {
    set_category_name(categoryName);
    setSearch("");
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("search");
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  useEffect(() => {
    let my_url = "";
    if (category_name === "") {
      my_url = `/store/?category_type=${filter}`;
    } else {
      my_url = `/store/?category_name=${category_name}&category_type=${filter}`;
    }
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + my_url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log("Fetched goods:", response.data);
        if (Array.isArray(response.data)) {
          set_goods_list(response.data);
        } else {
          console.error("Expected an array of goods");
        }
      })
      .catch((error) => {
        console.log("Error fetching goods:", error);
      });
  }, [category_name, filter]);

  /////////// Search /////////////
  if (!search == "") {
    useEffect(() => {
      let data = JSON.stringify({
        search: search,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_API + "/store/search",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          set_goods_list(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  } else {
    useEffect(() => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_API + `/store/?category_type=${filter}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .request(config)
        .then((response) => {
          set_goods_list(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [filter]);
  }

  function StarAVG(value) {
    let star_avg = (value / 5) * 100;
    if (star_avg === 0) {
      star_avg = 100;
    }
    return star_avg;
  }

  // ==== Paginator management ====
  // Calculate index range for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGoods = goods_list.slice(startIndex, endIndex);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [activeSlide, setActiveSlide] = useState(0);

  ////////// List displayed point ///////////
  const [point, setPoint] = useState([
    {
      point_view: "",
      images: [],
    },
  ]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/${store_id}/stocked`,
      headers: {},
    };

    if (!store_id) {
      console.error("Store ID is not available.");
      return;
    }

    axios
      .request(config)
      .then((response) => {
        setPoint(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      });
  }, [store_id]);

  const [selectedPointImages, setSelectedPointImages] = useState([]);
  const [selectedPointId, setSelectedPointId] = useState(null);
  const [selectedPointView, setSelectedPointView] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePointClick = (id) => {
    const pointItem = point.find((pointItem) => pointItem.id === id);
    if (pointItem) {
      setSelectedPointId(id);
      setSelectedPointView(pointItem.point_view === id);
      setSelectedImage(pointItem.images[0]);

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_API + `/store/stocked/${id}`,
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          if (response.data.images && response.data.images.length > 0) {
            setSelectedPointImages(response.data.images);
            setActiveSlide(0); // ตั้งค่า activeSlide เป็น 0
            setSelectedImage(response.data.images[0]);
          } else {
            console.log("No images found in response");
            setSelectedPointImages([]); // ตั้งค่าเป็นอาร์เรย์ว่าง
          }
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
          setSelectedPointImages([]); // ตั้งค่าเป็นอาร์เรย์ว่าง
        });
    }
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/list`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_goods_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  useEffect(() => {
    const imagesWithIds = selectedPointImages.map((image) => ({
      id: image.id,
      image: image.image,
    }));
    setImags(imagesWithIds);
  }, [selectedPointImages]);

  return (
    <div>
      <Header set_category_name={set_category_name} />
      <Banner />
      <div className="category_container2">
        {category_list.map((category, index) => (
          <div className="box-category" key={index}>
            <button
              value={category.name}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="image">
                <img className="boxImage" src={category.image} alt="image" />
              </div>
              <p>{category.name}</p>
            </button>
          </div>
        ))}
      </div>

      <div className="containner_slide_box3D_point">
        <div className="slider_box3D">
          <div
            ref={imageRef}
            style={{ position: "relative", display: "inline-block" }}
            className="slide_box3D"
          >
            <svg className="line-overlay">
              <image
                href={imags[currentImageIndex]?.image}
                preserveAspectRatio="none"
              />
            </svg>
          </div>

          <div className=" but1_box3D">
            <div
              className="nav-btn_box3D"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev > 0 ? prev - 1 : imags.length - 1
                )
              }
            >
              &#8249;
            </div>
          </div>
          <div className=" but2_box3D">
            <div
              className="nav-btn_box3D "
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev < imags.length - 1 ? prev + 1 : 0
                )
              }
            >
              &#8250;
            </div>
          </div>
        </div>

        <div className="containner_point">
          {point.map((pointItem, index) => (
            <div
              className="box_GrStatusGoodSmall"
              key={index}
              onClick={() => handlePointClick(pointItem.id)}
            >
              <GrStatusGoodSmall id={`GrStatusGoodSmall-${index}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="product">
        <div className="productHead_content">
          <h1 className="htxthead">
            <span className="spennofStyle"></span>Product
          </h1>
          <div className="categoryBoxfiler">
            <form className="boxfilterseach">
              <select
                className="filter_priceProduct"
                onClick={(e) => set_filter(e.target.value)}
              >
                <option value="1">Latest</option>
                <option value="3">Sort by review</option>
                <option value="2">Highest price</option>
                <option value="4">Low to highest prices</option>
              </select>
            </form>
          </div>
        </div>

        <div className="product-area">
          {goods_list.map(
            (i, index) =>
              i.category !== "Food" && (
                <div className="box-product" key={index}>
                  <Link to={`/goods/${i.id}`}>
                    <div className="img">
                      <img src={i.images} alt="" />
                    </div>
                    <div className="star">
                      <div
                        className="on"
                        style={{ width: `${StarAVG(i.star_avg)}%` }}
                      ></div>
                    </div>
                    <ul className="txtOFproduct2">
                      <li className="name">{i.name}</li>
                      <li className="price">$ {i.format_price}</li>
                    </ul>
                  </Link>
                </div>
              )
          )}
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default Search;
