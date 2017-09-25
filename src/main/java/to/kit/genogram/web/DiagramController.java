package to.kit.genogram.web;

import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import to.kit.genogram.entity.Diagram;
import to.kit.genogram.entity.Partner;
import to.kit.genogram.service.DiagramService;
import to.kit.genogram.web.form.DiagramForm;
import to.kit.genogram.web.form.EditingForm;
import to.kit.genogram.web.form.ResultForm;

/**
 * ダイアグラムコントローラー.
 * @author H.Sasai
 */
@Controller
@RequestMapping("/diagram")
public class DiagramController {
	@Autowired
	private DiagramService diagramService;

	/**
	 * 一覧取得.
	 * @return 一覧
	 */
	@RequestMapping("/list")
	@ResponseBody
	public List<Diagram> list() {
		return this.diagramService.list();
	}

	/**
	 * 一件取得.
	 * @param id ダイアグラムID
	 * @return レコード
	 */
	@RequestMapping("/select")
	@ResponseBody
	public Diagram select(@RequestParam String id) {
		return this.diagramService.select(id);
	}

	/**
	 * 編集画面表示.
	 * @param model モデル
	 * @param documentId ドキュメントID
	 * @return 画面名
	 */
	@RequestMapping("/edit/{id}")
	public String edit(Model model, @PathVariable("id") String documentId) {
		Diagram diagram = this.diagramService.detail(documentId);

		if (diagram == null) {
			diagram = new Diagram();
			diagram.setDocumentId(documentId);
		}
		model.addAttribute("default", new EditingForm());
		model.addAttribute("diagram", diagram);
		return "edit";
	}

	/**
	 * 編集画面表示.
	 * @param model モデル
	 * @param form フォーム
	 * @return 画面名
	 */
	@RequestMapping("/edit")
	public String edit(Model model, EditingForm form) {
		String documentId = form.getId();
		Diagram diagram = this.diagramService.detail(documentId);

		if (diagram == null) {
			diagram = new Diagram();
			diagram.setDocumentId(documentId);
		}
		model.addAttribute("default", form);
		model.addAttribute("diagram", diagram);
		return "edit";
	}

	/**
	 * イメージ表示.
	 * @param documentId ドキュメントID
	 * @return 画面名
	 */
	@RequestMapping("/image/{id}")
	@ResponseBody
	public ResponseEntity<Resource> image(@PathVariable("id") String documentId) {
		Diagram diagram = this.diagramService.detail(documentId);
		HttpHeaders headers = new HttpHeaders();

		if (diagram == null) {
			return new ResponseEntity<>(null, headers, HttpStatus.NOT_FOUND);
		}
		String image = diagram.getImage();
		if (image == null || image.isEmpty()) {
			return new ResponseEntity<>(null, headers, HttpStatus.NOT_FOUND);
		}
		String[] elements = image.split("[:;,]");
		String type = elements[1];
		String base64 = elements[3];
//		byte[] bytes = Base64.getMimeDecoder().decode(base64);
		byte[] bytes = Base64Utils.decodeFromString(base64);
		Resource resource = new ByteArrayResource(bytes);

		headers.setContentType(MediaType.valueOf(type));
		return new ResponseEntity<>(resource, headers, HttpStatus.OK);
	}

	private void saveImage(DiagramForm form, Diagram diagram) {
		String filename = form.getFilename();

		if (filename == null || filename.isEmpty()) {
			return;
		}
		File file = new File(filename);
		String formatName = filename.endsWith(".png") ? "PNG": "JPEG";
		double scale = form.getScale();
		String image = diagram.getImage();
		String[] elements = image.split("[:;,]");
		String base64 = elements[3];
		byte[] bytes = Base64Utils.decodeFromString(base64);

		try (InputStream in = new ByteArrayInputStream(bytes)) {
			BufferedImage src = ImageIO.read(in);
			int width = (int) (src.getWidth() * scale);
			int height = (int) (src.getHeight() * scale);
			BufferedImage dist = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			Graphics g = dist.getGraphics();

			g.drawImage(src, 0, 0, width, height, null);
			g.dispose();
			file.getParentFile().mkdirs();
			ImageIO.write(dist, formatName, file);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 保存.
	 * @param form フォーム
	 * @return 結果フォーム
	 */
	@RequestMapping("/save")
	@ResponseBody
	public ResultForm save(DiagramForm form) {
		ResultForm result = new ResultForm();
		Diagram diagram = new Diagram();
		List<Partner> pairList = new ArrayList<>(form.getPartnerList());
		BeanUtils.copyProperties(form, diagram);
		Diagram saved = this.diagramService.save(diagram);

		if (saved == null) {
			return result;
		}
		diagram.setPartnerList(pairList); // clearしたリストを戻す
		this.diagramService.clearUnused(diagram);
		saveImage(form, saved);
		result.setInfo(saved);
		result.setOk(true);
		return result;
	}
}
