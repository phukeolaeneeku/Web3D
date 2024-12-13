import "./productHome.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GrStatusGoodSmall } from "react-icons/gr";
import Modal from "react-modal";
import { MdFullscreen } from "react-icons/md";

const ProductHome = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [logo, set_logo] = useState(null);
  const navigate = useNavigate();
  const [goods_list, set_goods_list] = useState([]);
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const [filter, set_filter] = useState(1);
  const [store_list, set_store_list] = useState([]);
  const [category_name, set_category_name] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imags, setImags] = useState([]);
  const imageRef = useRef(null);
  const image_id = imags[currentImageIndex]?.id;

  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,

      url: import.meta.env.VITE_API + "/store/stores/",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_store_list(response.data);
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

  useEffect(() => {
    let my_url = "";
    if (storage) {
      if (!storage.is_admin && store_id) {
        my_url = `/store/?store_id=${store_id}`;
      } else {
        my_url = `/store/`;
      }
    } else {
      my_url = `/store/`;
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
        if (response.data && response.data.length > 0) {
          set_goods_list(response.data);
        } else {
          set_goods_list([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category_name, filter]);

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
  }, []);

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
            setActiveSlide(0); // ต้งค่า activeSlide เปน 0
            setSelectedImage(response.data.images[0]);
          } else {
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
        `/store/${store_id}/stocked-image/${image_id}/goods/list`,
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

  const [isStoreClicked, setIsStoreClicked] = useState(false);
  const handleStoreClick = (id) => {
    setIsStoreClicked(true);
  };

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClickOnXAxis = (x, y) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API +
        `/store/stocked-image/${image_id}/products/area/?start_x=${x}&end_x=${x}&start_y=${y}&end_y=${y}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.length > 0) {
          setSelectedProduct(response.data[0]);
          setIsModalOpen(true);
        }
      })
      .catch((error) => {
        console.log("Error fetching product data:", error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleFullscreenClick = () => {
    if (imageRef.current) {
      if (!document.fullscreenElement) {
        if (imageRef.current.requestFullscreen) {
          imageRef.current.requestFullscreen();
        } else if (imageRef.current.webkitRequestFullscreen) { /* Safari */
          imageRef.current.webkitRequestFullscreen();
        } else if (imageRef.current.msRequestFullscreen) { /* IE11 */
          imageRef.current.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen();
        }
      }
    }
  };

  return (
    <>
      <div>
        <div className="store_list">Store list</div>
        <div className="category_container2">
          {store_list.map((store, index) => (
            <div className="box-category" key={index}>
              <button onClick={() => handleStoreClick(store.id)}>
                <div className="image">
                  <img className="boxImage" src="#" alt="image" />
                </div>
                <p>{store.name}</p>
              </button>
            </div>
          ))}
        </div>

        <div
          className="containner_slide_box3D_point"
          style={{ display: isStoreClicked ? "" : "none" }}
        >
          <div className="slider_box3D">
            <div
              ref={imageRef}
              style={{ width: "100%", height: "100%", position: "relative", display: "inline-block" }}
              className="slide_box3D"
            >
              <svg
                className="line-overlay"
                onClick={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  handleClickOnXAxis(x, y);
                }}
              >
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
            <div className="edit_image_screen" onClick={handleFullscreenClick}>
              <MdFullscreen id="box_icon_camera_screen" />
            </div>
          </div>

          <div className="containner_point">
            <div style={{ overflow: point.length > 4 ? "auto" : "hidden" }}>
              {point.length > 0 ? (
                point.map((pointItem, index) => (
                  <div className="box_GrStatusGoodSmall" key={index}>
                    <div
                      onClick={() => {
                        handlePointClick(pointItem.id);
                      }}
                    >
                      <GrStatusGoodSmall id={`GrStatusGoodSmall-${index}`} />
                    </div>
                    <p className="point_viewname">{pointItem.point_view}</p>
                  </div>
                ))
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>

        <div className="product">
          <div className="productHead_content">
            <h1 className="htxthead">
              <span className="spennofStyle"></span>Product
            </h1>
          </div>

          <div className="product-area">
            {goods_list.map(
              (i, index) =>
                i.category !== "Food" && (
                  <div className="box-product" key={index}>
                    <Link to={`/goods/${i.id}`} onClick={handleClick}>
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
                        <li className="price">$ {i.price}</li>
                      </ul>
                    </Link>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
      <Modal
        className="container_box_popup"
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <div className="box-product_popup">
          {selectedProduct && (
            <div className="img">
              <Link
                to={`/goods/${selectedProduct.goods_id}`}
                onClick={handleClick}
              >
                <div className="">
                  <img
                    src={import.meta.env.VITE_API + selectedProduct.images}
                    alt=""
                  />
                </div>
                <ul className="txtOFproduct2">
                  <li className="name">{selectedProduct.name}</li>
                  <li className="price">$ {selectedProduct.price}</li>
                </ul>
              </Link>
            </div>
          )}
        </div>

        <button className="BTN_Close" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </>
  );
};

export default ProductHome;
