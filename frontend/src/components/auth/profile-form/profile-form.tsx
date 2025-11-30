import './profile-form.css';
import '../../../assets/css/asset.css';
import '../../../assets/css/index.css';
import {Calendar, Users, Sparkles} from "lucide-react";
import { Hobby } from '../../ui/hobby/hobby';

export function ProfileForm(){
    const user = null;

    if (!user) {
      return (
        <div className="profile-form">
          <div className="cont-content-profile">
            <div className="content-profile">Không tìm thấy người dùng</div>
          </div>
        </div>
      )
    }

    return(
        <div className="profile-form">
            <div className="cont-content-profile">
                <div className="content-profile">
                    <div className="info-01-profile">
                        <div className="avatar-user">
                            <img src='../../../../public/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg'></img>
                        </div>
                        <div className="name-user">Nguyễn Lâm Anh</div>
                        <div className="born-user">Hà Nội, VIệt Nam</div>
                    </div>
                    <div className="info-profile">
                        <div className="cont-info-user">
                            <div className="title-info">
                                <Calendar className='style-icon cl-blue'/>
                                <span>Ngày sinh</span>
                            </div>
                            <div className="detail-info">22/03/2006</div>
                        </div>
                        <div className="cont-info-user">
                            <div className="title-info">
                                <Users className='style-icon cl-blue'/>
                                <span>Giới tính</span>
                            </div>
                            <div className="detail-info">Nam</div>
                        </div>
                    </div>
                    <div className="info-profile">
                        <div className="cont-info-user">
                            <div className="title-info">
                                <Sparkles className='style-icon cl-blue'/>
                                <span>Về tôi</span>
                            </div>
                            <div className="detail-info">Chào mọi người! Mình là Thảo, một người yêu thích du lịch và khám phá những điều mới mẻ. Mình làm việc trong lĩnh vực Marketing và rất đam mê với công việc sáng tạo. Khi không làm việc, mình thường dành thời gian để đọc sách, nghe nhạc acoustic, hoặc thử các công thức nấu ăn mới. Mình thích những cuộc trò chuyện sâu sắc, có ý nghĩa và luôn sẵn lòng kết bạn với những người có cùng sở thích. Hy vọng tìm được những người bạn chân thành hoặc một mối quan hệ nghiêm túc tại đây.</div>
                        </div>
                    </div>
                    <div className="info-profile">
                        <div className="cont-info-user">
                            <div className="title-info">Sở thích</div>
                            <div className="detail-info hobby-info">
                                <span className="btn-hobby">Du lịch</span>
                                <span className="btn-hobby">Âm nhạc</span>
                                <span className="btn-hobby">Nấu ăn</span>
                                <span className="btn-hobby">Đọc sách</span>
                                <span className="btn-hobby">Chơi thể thao</span>
                            </div>
                        </div>
                    </div>
                    <div className="info-profile">
                        <div className="cont-info-user">
                            <div className="title-info">Thư viện ảnh</div>
                            <div className="detail-info img-library">
                                <img src='../../../../public/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg'></img>
                                <img src='../../../../public/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg'></img>
                            </div>
                        </div>
                    </div>
                    <div className="info-profile">
                        <div className="cont-info-user">
                            <div className="title-info">Ưu tiên tìm kiếm</div>
                            <div className="detail-info">Tìm kiếm mối quan hệ nghiêm túc, bạn bè, hoặc người có cùng sở thích để trò chuyện.</div>
                        </div>
                    </div>
                </div>
                <div className="cont-btn-action">
                    <button className="btn-short cl-blue">Chỉnh sửa hồ sơ</button>
                </div>
            </div>
        </div>
    )

}